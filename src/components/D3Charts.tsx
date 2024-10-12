import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import * as d3 from "d3";
import { Svg, Rect, G, Text as SvgText } from "react-native-svg";
import { formatToRands } from "../utils/currencyUtil";
import tokens from "../styles/tokens";

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
  width?: number;
  height?: number;
  timeFrame: "months" | "days";
}

const D3Charts: React.FC<BarChartProps> = ({
  data,
  title,
  width,
  height,
  timeFrame,
}) => {
  const [tooltip, setTooltip] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);
  const chartWidth = width || Dimensions.get("window").width * 1.5;
  const chartHeight = height || 300;

  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const chartInnerWidth = chartWidth - margin.left - margin.right;
  const chartInnerHeight = chartHeight - margin.top - margin.bottom;

  // Create a list of all months (or days of the week) that you want to display
  const allLabels =
    timeFrame === "months"
      ? [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Fill data to include all months with zero values where necessary
  const filledData = allLabels.map((label) => {
    const existingData = data.find((d) => d.label === label);
    return existingData ? existingData : { label, value: 0 };
  });

  const xScale = d3
    .scaleBand()
    .domain(filledData.map((d) => d.label))
    .range([0, chartInnerWidth])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(filledData, (d) => d.value)!])
    .range([chartInnerHeight, 0]);

  const getColor = (value: number) => (value < 10 ? "red" : "#7fbf73");

  const handlePress = (
    label: string,
    value: number,
    barX: number,
    barY: number
  ) => {
    setTooltip({ label, value });
    setSelectedBar(label);
    setTooltipPosition({ x: barX, y: barY });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(event.nativeEvent.contentOffset.x);
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal onScroll={handleScroll} scrollEventThrottle={16}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* X-axis labels */}
          <G
            transform={`translate(${margin.left},${
              chartInnerHeight + margin.top
            })`}
          >
            {filledData.map((d, i) => (
              <SvgText
                key={i}
                x={xScale(d.label)! + xScale.bandwidth() / 2}
                y={20}
                fontSize="10"
                fill="black"
                textAnchor="middle"
              >
                {d.label}
              </SvgText>
            ))}
          </G>

          {/* Y-axis and Bars */}
          <G transform={`translate(${margin.left},${margin.top})`}>
            {yScale.ticks(5).map((tickValue, i) => (
              <SvgText
                key={i}
                x={-10}
                y={yScale(tickValue)}
                fontSize="10"
                fill="black"
                textAnchor="end"
              >
                {tickValue}
              </SvgText>
            ))}

            {filledData.map((d, i) => {
              const barX = xScale(d.label);
              const barY = yScale(d.value);
              return (
                <G key={i}>
                  <Rect
                    x={barX}
                    y={barY}
                    width={xScale.bandwidth()}
                    height={chartInnerHeight - barY}
                    fill={getColor(d.value)}
                    onPress={() =>
                      handlePress(
                        d.label,
                        d.value,
                        barX! + xScale.bandwidth() / 2,
                        barY
                      )
                    }
                  />
                  {/* Display value inside the clicked bar */}
                  {selectedBar === d.label && (
                    <SvgText
                      x={barX! + xScale.bandwidth() / 2}
                      y={barY - 5} // Position the text above the bar
                      fontSize="12"
                      fill={tokens.colors.circularProgress}
                      textAnchor="middle"
                      fontWeight={"800"}
                      fontFamily="GorditaMedium"
                    >
                      {formatToRands(d.value)}
                    </SvgText>
                  )}
                </G>
              );
            })}
          </G>
        </Svg>
      </ScrollView>

      {tooltip && (
        <View
          style={[
            styles.tooltip,
            {
              left: tooltipPosition.x - scrollOffset - margin.left,
              top: tooltipPosition.y + margin.top - 15,
            },
          ]}
        >
          <Text style={styles.tooltipText}>
            On {tooltip.label}: you made {formatToRands(tooltip.value)}
          </Text>
        </View>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: "red" }]} />
          <Text style={styles.legendText}>Low Performing</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: "#7fbf73" }]} />
          <Text style={styles.legendText}>High Performing</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "GorditaMedium",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 4,
    padding: 10,
    elevation: 5,
    zIndex: 100,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "GorditaRegular",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    fontFamily: "GorditaRegular",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    fontFamily: "GorditaRegular",
  },
});

export default D3Charts;
