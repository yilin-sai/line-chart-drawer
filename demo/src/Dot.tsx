import { Line as L, LabelList, LineChart, XAxis, YAxis } from "recharts";

export default function Dot({
  v,
  label,
  elementKey,
  index,
  min,
  max,
}: {
  v: number;
  label: string;
  elementKey: string;
  index: number;
  min: number;
  max: number;
}) {
  return (
    <LineChart
      width={360}
      height={40}
      layout="vertical"
      data={[{ value: v, label }]}
    >
      <XAxis type="number" domain={[min, max]} hide />
      <YAxis type="category" dataKey="name" hide />
      <L id={`${elementKey}_${index}`} dataKey="value" strokeWidth={0}>
        {v - min > (max - min) / 2 ? (
          <LabelList dataKey="label" position="left" fill="black" />
        ) : (
          <LabelList dataKey="label" position="right" fill="black" />
        )}
      </L>
    </LineChart>
  );
}
