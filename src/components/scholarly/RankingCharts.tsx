// ============================================================================
// RANKING CHARTS COMPONENT
// ============================================================================
// Bar and Line charts for scholarly ranking visualization
// Uses Recharts with academic, minimal styling
// ============================================================================

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import type { ChartDataPoint, TrendDataPoint } from '@/utils/scholarlyRankingTypes';

// -----------------------------------------------------------------------------
// BAR CHART COMPONENT
// -----------------------------------------------------------------------------

interface RankingBarChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
}

export const RankingBarChart: React.FC<RankingBarChartProps> = ({
  data,
  title,
  height = 300,
}) => {
  const styles = `
    .sr-chart-container {
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      padding: 20px 24px;
    }

    .sr-chart-title {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 16px 0;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .sr-chart-wrapper {
      width: 100%;
    }

    .sr-chart-tooltip {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 6px;
      padding: 10px 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .sr-chart-tooltip__label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 500;
      color: #57534E;
      margin: 0 0 4px 0;
    }

    .sr-chart-tooltip__value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0;
    }
  `;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="sr-chart-tooltip">
          <p className="sr-chart-tooltip__label">{label}</p>
          <p className="sr-chart-tooltip__value">
            {payload[0].value.toLocaleString()} articles
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sr-chart-container">
        {title && <h3 className="sr-chart-title">{title}</h3>}
        <div className="sr-chart-wrapper">
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <XAxis
                type="number"
                stroke="#A8A29E"
                fontSize={12}
                fontFamily="Source Sans Pro"
                tickLine={false}
                axisLine={{ stroke: '#E7E5E4' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#57534E"
                fontSize={12}
                fontFamily="Source Sans Pro"
                tickLine={false}
                axisLine={false}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F5F4' }} />
              <Bar
                dataKey="value"
                fill="#1E3A5F"
                radius={[0, 4, 4, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

// -----------------------------------------------------------------------------
// LINE CHART COMPONENT
// -----------------------------------------------------------------------------

interface TrendLineChartProps {
  data: TrendDataPoint[];
  title?: string;
  height?: number;
  showArea?: boolean;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  title,
  height = 200,
  showArea = true,
}) => {
  const styles = `
    .sr-trend-chart-container {
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      padding: 20px 24px;
    }

    .sr-trend-chart-title {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 16px 0;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .sr-trend-tooltip {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 6px;
      padding: 10px 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .sr-trend-tooltip__label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 500;
      color: #57534E;
      margin: 0 0 4px 0;
    }

    .sr-trend-tooltip__value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0;
    }
  `;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="sr-trend-tooltip">
          <p className="sr-trend-tooltip__label">{label}</p>
          <p className="sr-trend-tooltip__value">
            {payload[0].value.toLocaleString()} articles
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sr-trend-chart-container">
        {title && <h3 className="sr-trend-chart-title">{title}</h3>}
        <ResponsiveContainer width="100%" height={height}>
          {showArea ? (
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="#A8A29E"
                fontSize={11}
                fontFamily="Source Sans Pro"
                tickLine={false}
                axisLine={{ stroke: '#E7E5E4' }}
              />
              <YAxis
                stroke="#A8A29E"
                fontSize={11}
                fontFamily="Source Sans Pro"
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="articles"
                stroke="#1E3A5F"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorArticles)"
              />
            </AreaChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                stroke="#A8A29E"
                fontSize={11}
                fontFamily="Source Sans Pro"
                tickLine={false}
                axisLine={{ stroke: '#E7E5E4' }}
              />
              <YAxis
                stroke="#A8A29E"
                fontSize={11}
                fontFamily="Source Sans Pro"
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="articles"
                stroke="#1E3A5F"
                strokeWidth={2}
                dot={{ fill: '#1E3A5F', strokeWidth: 0, r: 3 }}
                activeDot={{ fill: '#1E3A5F', strokeWidth: 0, r: 5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </>
  );
};

// -----------------------------------------------------------------------------
// SPARKLINE COMPONENT (Mini trend indicator)
// -----------------------------------------------------------------------------

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 80,
  height = 24,
  color = '#1E3A5F',
}) => {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// -----------------------------------------------------------------------------
// RANKING HISTORY CHART
// -----------------------------------------------------------------------------

interface RankingHistoryChartProps {
  data: { date: string; rank: number }[];
  title?: string;
  height?: number;
}

export const RankingHistoryChart: React.FC<RankingHistoryChartProps> = ({
  data,
  title,
  height = 200,
}) => {
  const styles = `
    .sr-rank-history-container {
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      padding: 20px 24px;
    }

    .sr-rank-history-title {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 16px 0;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .sr-rank-tooltip {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 6px;
      padding: 10px 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .sr-rank-tooltip__label {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.75rem;
      font-weight: 500;
      color: #57534E;
      margin: 0 0 4px 0;
    }

    .sr-rank-tooltip__value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0;
    }
  `;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="sr-rank-tooltip">
          <p className="sr-rank-tooltip__label">{label}</p>
          <p className="sr-rank-tooltip__value">Rank #{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Invert Y axis for ranking (lower number = better = higher on chart)
  const maxRank = Math.max(...data.map((d) => d.rank));

  return (
    <>
      <style>{styles}</style>
      <div className="sr-rank-history-container">
        {title && <h3 className="sr-rank-history-title">{title}</h3>}
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              stroke="#A8A29E"
              fontSize={11}
              fontFamily="Source Sans Pro"
              tickLine={false}
              axisLine={{ stroke: '#E7E5E4' }}
            />
            <YAxis
              stroke="#A8A29E"
              fontSize={11}
              fontFamily="Source Sans Pro"
              tickLine={false}
              axisLine={false}
              width={30}
              reversed
              domain={[1, maxRank + 1]}
              tickFormatter={(value) => `#${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="stepAfter"
              dataKey="rank"
              stroke="#2D5A47"
              strokeWidth={2}
              dot={{ fill: '#2D5A47', strokeWidth: 0, r: 4 }}
              activeDot={{ fill: '#2D5A47', strokeWidth: 0, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

// -----------------------------------------------------------------------------
// DISCIPLINE BREAKDOWN CHART
// -----------------------------------------------------------------------------

interface DisciplineBreakdownProps {
  data: { discipline: string; count: number; percentage: number }[];
  title?: string;
}

export const DisciplineBreakdown: React.FC<DisciplineBreakdownProps> = ({
  data,
  title,
}) => {
  const styles = `
    .sr-discipline-container {
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 8px;
      padding: 20px 24px;
    }

    .sr-discipline-title {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 20px 0;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .sr-discipline-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sr-discipline-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .sr-discipline-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .sr-discipline-name {
      font-family: 'Source Sans Pro', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1C1917;
      margin: 0;
    }

    .sr-discipline-percentage {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #57534E;
    }

    .sr-discipline-bar-bg {
      width: 100%;
      height: 8px;
      background: #F5F5F4;
      border-radius: 4px;
      overflow: hidden;
    }

    .sr-discipline-bar-fill {
      height: 100%;
      background: #1E3A5F;
      border-radius: 4px;
      transition: width 0.5s ease;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="sr-discipline-container">
        {title && <h3 className="sr-discipline-title">{title}</h3>}
        <div className="sr-discipline-list">
          {data.map((item, index) => (
            <div key={item.discipline} className="sr-discipline-item">
              <div className="sr-discipline-header">
                <p className="sr-discipline-name">{item.discipline}</p>
                <span className="sr-discipline-percentage">{item.percentage}%</span>
              </div>
              <div className="sr-discipline-bar-bg">
                <div
                  className="sr-discipline-bar-fill"
                  style={{
                    width: `${item.percentage}%`,
                    opacity: 1 - index * 0.12,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default {
  RankingBarChart,
  TrendLineChart,
  Sparkline,
  RankingHistoryChart,
  DisciplineBreakdown,
};
