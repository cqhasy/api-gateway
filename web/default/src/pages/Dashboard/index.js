import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'semantic-ui-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { API } from '../../helpers';
import { PageHeader, MetricCard, MetricGrid } from '../../components/muxi';
import './Dashboard.css';

const CHART_COLORS = {
  requests: '#2563eb',
  quota: '#7c3aed',
  tokens: '#16a34a',
};

const BAR_COLORS = [
  '#2563eb', '#7c3aed', '#16a34a', '#d97706', '#dc2626',
  '#0891b2', '#4f46e5', '#059669', '#ea580c', '#db2777',
];

const CHART_TOOLTIP_STYLE = {
  background: 'var(--bg-tooltip)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-sm)',
  boxShadow: 'var(--shadow-md)',
  color: 'var(--text-primary)',
  fontSize: '0.8125rem',
};

const formatLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    todayRequests: 0,
    todayQuota: 0,
    todayTokens: 0,
  });

  const locale = i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US';

  const numberFmt = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale]
  );

  const quotaFmt = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }),
    [locale]
  );

  const calculateSummary = useCallback(
    (dashboardData) => {
      if (!Array.isArray(dashboardData) || dashboardData.length === 0) {
        setSummaryData({ todayRequests: 0, todayQuota: 0, todayTokens: 0 });
        return;
      }

      const today = formatLocalDateKey(new Date());
      const todayData = dashboardData.filter((item) => item.Day === today);

      setSummaryData({
        todayRequests: todayData.reduce((sum, item) => sum + item.RequestCount, 0),
        todayQuota: todayData.reduce((sum, item) => sum + item.Quota, 0) / 1000000,
        todayTokens: todayData.reduce(
          (sum, item) => sum + item.PromptTokens + item.CompletionTokens,
          0
        ),
      });
    },
    []
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get('/api/user/dashboard');
        if (response.data.success) {
          const dashboardData = response.data.data || [];
          setData(dashboardData);
          calculateSummary(dashboardData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setData([]);
        calculateSummary([]);
      }
    };
    fetchDashboardData();
  }, [calculateSummary]);

  const getDateRange = useCallback(() => {
    const dates = data.map((item) => item.Day);
    const maxDate = new Date();
    let minDate =
      dates.length > 0
        ? new Date(Math.min(...dates.map((d) => new Date(d))))
        : new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    if (minDate > sevenDaysAgo) {
      minDate = sevenDaysAgo;
    }

    return { minDate, maxDate };
  }, [data]);

  const timeSeriesData = useMemo(() => {
    const dailyData = {};
    const { minDate, maxDate } = getDateRange();

    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatLocalDateKey(d);
      dailyData[dateStr] = { date: dateStr, requests: 0, quota: 0, tokens: 0 };
    }

    data.forEach((item) => {
      if (!dailyData[item.Day]) {
        dailyData[item.Day] = { date: item.Day, requests: 0, quota: 0, tokens: 0 };
      }
      dailyData[item.Day].requests += item.RequestCount;
      dailyData[item.Day].quota += item.Quota / 1000000;
      dailyData[item.Day].tokens += item.PromptTokens + item.CompletionTokens;
    });

    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  }, [data, getDateRange]);

  const modelData = useMemo(() => {
    const timeData = {};
    const { minDate, maxDate } = getDateRange();
    const models = [...new Set(data.map((item) => item.ModelName))];

    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatLocalDateKey(d);
      timeData[dateStr] = { date: dateStr };
      models.forEach((model) => {
        timeData[dateStr][model] = 0;
      });
    }

    data.forEach((item) => {
      if (timeData[item.Day]) {
        timeData[item.Day][item.ModelName] =
          item.PromptTokens + item.CompletionTokens;
      }
    });

    return Object.values(timeData).sort((a, b) => a.date.localeCompare(b.date));
  }, [data, getDateRange]);

  const models = useMemo(
    () => [...new Set(data.map((item) => item.ModelName))],
    [data]
  );

  const formatDate = useCallback(
    (dateStr) => {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat(locale, { month: 'numeric', day: 'numeric' }).format(date);
    },
    [locale]
  );

  const xAxisConfig = {
    dataKey: 'date',
    axisLine: false,
    tickLine: false,
    tick: { fontSize: 12, fill: 'var(--text-muted)', textAnchor: 'middle' },
    tickFormatter: formatDate,
    interval: 0,
    minTickGap: 5,
    padding: { left: 30, right: 30 },
  };

  const summaryCards = [
    {
      title: t('dashboard.charts.requests.title'),
      value: numberFmt.format(summaryData.todayRequests),
      dataKey: 'requests',
      color: CHART_COLORS.requests,
      tooltip: t('dashboard.charts.requests.tooltip'),
      formatter: (value) => [numberFmt.format(value), t('dashboard.charts.requests.tooltip')],
    },
    {
      title: t('dashboard.charts.quota.title'),
      value: quotaFmt.format(summaryData.todayQuota),
      dataKey: 'quota',
      color: CHART_COLORS.quota,
      tooltip: t('dashboard.charts.quota.tooltip'),
      formatter: (value) => [quotaFmt.format(value), t('dashboard.charts.quota.tooltip')],
    },
    {
      title: t('dashboard.charts.tokens.title'),
      value: numberFmt.format(summaryData.todayTokens),
      dataKey: 'tokens',
      color: CHART_COLORS.tokens,
      tooltip: t('dashboard.charts.tokens.tooltip'),
      formatter: (value) => [numberFmt.format(value), t('dashboard.charts.tokens.tooltip')],
    },
  ];

  return (
    <div className='muxi-animate-in muxi-dashboard'>
      <PageHeader
        title={t('header.dashboard')}
        description={t('dashboard.subtitle')}
      />

      <MetricGrid layout='emphasis-first' className='muxi-stagger-in'>
        {summaryCards.map((card, index) => (
          <MetricCard
            key={card.dataKey}
            label={card.title}
            value={card.value}
            sublabel={t('dashboard.summary.today')}
            size={index === 0 ? 'primary' : 'secondary'}
            highlight={index === 0}
            variant={index === 0 ? 'accent' : undefined}
          >
            <div className='muxi-chart-sparkline'>
              <ResponsiveContainer width='100%' height={index === 0 ? 112 : 88} margin={{ left: 0, right: 0 }}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} horizontal opacity={0.12} />
                  <XAxis {...xAxisConfig} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={CHART_TOOLTIP_STYLE}
                    formatter={card.formatter}
                    labelFormatter={(label) =>
                      `${t('dashboard.statistics.tooltip.date')}: ${formatDate(label)}`
                    }
                  />
                  <Line
                    type='monotone'
                    dataKey={card.dataKey}
                    stroke={card.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MetricCard>
        ))}
      </MetricGrid>

      <Card fluid className='chart-card muxi-chart-panel'>
        <Card.Content>
          <Card.Header>{t('dashboard.statistics.title')}</Card.Header>
          <div className='chart-container'>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={modelData}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} opacity={0.15} />
                <XAxis {...xAxisConfig} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value) => [numberFmt.format(value), t('dashboard.statistics.tooltip.value')]}
                  labelFormatter={(label) =>
                    `${t('dashboard.statistics.tooltip.date')}: ${formatDate(label)}`
                  }
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                {models.map((model, index) => (
                  <Bar
                    key={model}
                    dataKey={model}
                    stackId='a'
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                    name={model}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard;
