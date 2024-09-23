import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as d3 from 'd3';
import { Svg, Rect, G, Text as SvgText } from 'react-native-svg';

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
  width?: number;
  height?: number;
}

const D3Charts: React.FC<BarChartProps> = ({ data, title, width, height }) => {
  const [tooltip, setTooltip] = useState<{ label: string; value: number } | null>(null);
  const [selectedBar, setSelectedBar] = useState<string | null>(null); // Track the selected bar
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartWidth = width || Dimensions.get('window').width * 1.5; // Increase width for horizontal scroll
  const chartHeight = height || 300;

  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const chartInnerWidth = chartWidth - margin.left - margin.right;
  const chartInnerHeight = chartHeight - margin.top - margin.bottom;

  const xScale = d3
    .scaleBand()
    .domain(data.map(d => d.label))
    .range([0, chartInnerWidth])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.value)!])
    .range([chartInnerHeight, 0]);

  const getColor = (value: number) => (value < 10 ? 'red' : '#7fbf73');

  const handlePress = (label: string, value: number, barX: number, barY: number) => {
    setTooltip({ label, value });
    setSelectedBar(label); // Set the clicked bar as the selected one
    setTooltipPosition({ x: barX, y: barY });
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal>
        <Svg width={chartWidth} height={chartHeight}>
          {/* X-axis labels */}
          <G transform={`translate(${margin.left},${chartInnerHeight + margin.top})`}>
            {data.map((d, i) => (
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
              <SvgText key={i} x={-10} y={yScale(tickValue)} fontSize="10" fill="black" textAnchor="end">
                {tickValue}
              </SvgText>
            ))}

            {data.map((d, i) => {
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
                    onPress={() => handlePress(d.label, d.value, barX + xScale.bandwidth() / 2, barY)}
                  />
                  {/* Display value inside the clicked bar */}
                  {selectedBar === d.label && (
                    <SvgText
                      x={barX! + xScale.bandwidth() / 2}
                      y={barY - 5} // Position the text above the bar
                      fontSize="12"
                      fill="black"
                      textAnchor="middle"
                      fontWeight={'800'}
                    >
                      {"R "+d.value}
                    </SvgText>
                  )}
                </G>
              );
            })}
          </G>
        </Svg>
      </ScrollView>

      {tooltip && (
        <View style={[styles.tooltip, { left: tooltipPosition.x + margin.left, top: tooltipPosition.y + margin.top - 40 }]}>
          <Text style={styles.tooltipText}>
            On {tooltip.label}: you made R{tooltip.value}
          </Text>
        </View>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: 'red' }]} />
          <Text style={styles.legendText}>Low Performing</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#7fbf73' }]} />
          <Text style={styles.legendText}>High Performing</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  chartContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    padding: 10,
    elevation: 5,
    zIndex: 100,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
});

export default D3Charts;