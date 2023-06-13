const deepMerge = (obj1, obj2) => {
    if (typeof obj1 !== "object") return obj2;
    if (typeof obj2 !== "object") return obj1;

  // Create a new object that combines the properties of both input objects
  const merged = {
    ...obj1,
    ...obj2,
  };

  // Loop through the properties of the merged object
  for (const key of Object.keys(merged)) {
    // Check if the property is an object
    if (typeof merged[key] === "object" && merged[key] !== null) {
      // If the property is an object, recursively merge the objects
      merged[key] = deepMerge(obj1[key], obj2[key]);
    }
  }

  return merged;
};

export { deepMerge };
