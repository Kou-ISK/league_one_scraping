import { Paper, Tab, Tabs } from '@mui/material';

interface YearSelectionTabsProps {
  handleChange: (event: React.ChangeEvent<{}>, value: number) => void;
  year: number;
}

export const YearSelectionTabs = (props: YearSelectionTabsProps) => {
  return (
    <Paper>
      <Tabs
        value={props.year}
        onChange={(event, value) => props.handleChange(event, value)}
        indicatorColor='primary'
        textColor='primary'
        centered
      >
        <Tab label='2022' value={2021} />
        <Tab label='2022-2023' value={2022} />
        <Tab label='2023-2024' value={2023} />
      </Tabs>
    </Paper>
  );
};
