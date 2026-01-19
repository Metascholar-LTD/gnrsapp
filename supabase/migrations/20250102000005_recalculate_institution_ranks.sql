-- ============================================================================
-- RECALCULATE INSTITUTION RANKS FUNCTION
-- ============================================================================
-- Function to recalculate institution ranks sequentially after deletion
-- Ensures ranks are always 1, 2, 3, 4... with no gaps
-- ============================================================================

-- Function to recalculate ranks
CREATE OR REPLACE FUNCTION public.recalculate_institution_ranks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inst RECORD;
  new_rank INTEGER := 1;
  old_rank INTEGER;
BEGIN
  -- Loop through all active institutions ordered by current_rank
  -- This preserves existing order and just fills gaps (e.g., if rank 10 is deleted, rank 11 becomes 10)
  FOR inst IN 
    SELECT id, current_rank
    FROM public.institutions
    WHERE status = 'active'
    ORDER BY current_rank ASC NULLS LAST, name ASC
  LOOP
    old_rank := inst.current_rank;
    
    -- Update rank sequentially
    UPDATE public.institutions
    SET 
      previous_rank = old_rank,
      current_rank = new_rank,
      movement = CASE 
        WHEN old_rank IS NULL THEN 'stable'
        WHEN old_rank = new_rank THEN 'stable'
        WHEN old_rank > new_rank THEN 'up'  -- Lower number = higher rank (better)
        ELSE 'down'  -- Higher number = lower rank (worse)
      END,
      updated_at = now()
    WHERE id = inst.id;
    
    new_rank := new_rank + 1;
  END LOOP;
END;
$$;

-- Create trigger to automatically recalculate ranks after deletion
CREATE OR REPLACE FUNCTION public.recalculate_ranks_after_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Recalculate ranks after an institution is deleted
  PERFORM public.recalculate_institution_ranks();
  RETURN OLD;
END;
$$;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_recalculate_ranks_after_delete ON public.institutions;

-- Create trigger
CREATE TRIGGER trigger_recalculate_ranks_after_delete
AFTER DELETE ON public.institutions
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_ranks_after_delete();

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
