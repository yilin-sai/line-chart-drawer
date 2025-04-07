import { useLineDrawer } from "line-chart-drawer";
import { Table } from "antd";
import dataSource from "../data/data.json";
import "./App.css";
import Dot from "./Dot";
import { useEffect } from "react";

const App = () => {
  const { redrawLine } = useLineDrawer(
    "purchase",
    "chart-container",
    {color: "#00AEEF"},
  );

  useEffect(() => {
    redrawLine();
  });

  const columns = [
    {
      title: "Store",
      dataIndex: "store",
      key: "store",
      onCell: (_: unknown, index: number | undefined) => ({
        rowSpan: index === 0 ? 10 : 0,
        className: "cellTop",
      }),
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Purchase Number",
      dataIndex: "purchase",
      key: "purchase",
      render: (v: number, _: unknown, index: number) => (
        <Dot
          v={v}
          label={String(v)}
          elementKey="purchase"
          index={index!}
          min={0}
          max={100}
        />
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      bordered
      pagination={false}
      components={{
        table: (props: object) => <table {...props} id={"chart-container"} />,
      }}
    />
  );
};

export default App;
