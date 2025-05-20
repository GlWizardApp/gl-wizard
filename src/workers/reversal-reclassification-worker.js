self.onmessage = (event) => {
  const { rawData, selectedHeaders, selectedFilters } = event.data;

  const output = rawData.glData.map((item) => {
    const foundCoaItems = rawData.coaData.filter((coaItem) => {
      return String(item[selectedHeaders.glHeaders.account])?.includes(
        coaItem[selectedHeaders.coaHeaders.mappingValue]
      );
    });
    const betterMatchingCoaItem = foundCoaItems.sort(
      (a, b) => b.length - a.length
    )[0];

    return {
      ...item,
      [selectedFilters.header]: betterMatchingCoaItem[selectedFilters.header],
      coaData: betterMatchingCoaItem,
    };
  });

  const filtered = output.filter((item) =>
    selectedFilters.header && selectedFilters.value
      ? item.coaData[selectedFilters.header] === selectedFilters.value
      : true
  );

  const groupedByAccountAndDate = filtered.reduce((acc, curr) => {
    const key = `${curr[selectedHeaders.glHeaders.date]}_${
      curr[selectedHeaders.glHeaders.account]
    }`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  for (const [, rows] of Object.entries(groupedByAccountAndDate)) {
    let i = 0;
    while (i < rows.length) {
      const chunk = [];
      let sum = 0;

      for (let j = i; j < rows.length; j++) {
        chunk.push(rows[j]);
        sum =
          Number(sum.toFixed(2)) +
          Number(Number(rows[j][selectedHeaders.glHeaders.value]).toFixed(2));
        // Check if the sum of the chunk is zero
        if (sum === 0) {
          // Assign the result property to each row in the chunk
          chunk.forEach((row) => (row.result = "reversal/reclassification"));

          // Move to the next unprocessed rows
          i = j + 1;
          break;
        }
      }

      // If the loop ends without finding a zero sum, increase the chunk size
      if (sum !== 0) {
        i++; // Increase starting point to prevent infinite loop
      }
    }
  }

  self.postMessage({ groupedByAccountAndDate });
};
