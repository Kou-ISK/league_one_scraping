import { SegmentedControl } from '../components/molecules/SegmentedControl';

interface YearSelectionTabsProps {
  handleChange: (event: React.ChangeEvent<{}>, value: number) => void;
  year: number;
}

export const YearSelectionTabs = (props: YearSelectionTabsProps) => {
  return (
    <SegmentedControl
      ariaLabel='シーズン切替'
      value={props.year}
      onChange={(value) => props.handleChange({} as React.ChangeEvent<{}>, value)}
      options={[
        { label: '2022', value: 2021 },
        { label: '2022-2023', value: 2022 },
        { label: '2023-2024', value: 2023 },
        { label: '2025-2026', value: 2026 },
      ]}
    />
  );
};
