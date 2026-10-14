// The upstream save format stores data only. Restore game methods from pinned constructors.
window.JSONfn = {
  stringify(value) {
    return JSON.stringify(value, function (key, item) {
      if (typeof item !== "function") return item;
      if (key !== "currentFunction") return undefined;
      const methods = [
        "randomGeneration",
        "circleGeneration",
        "halfCircleGeneration",
        "crosswiseGeneration",
        "spiralGeneration",
        "doubleGeneration",
      ];
      const name = methods.find((method) => this[method] === item);
      return name ? { __dennyHextrisFunction: name } : undefined;
    });
  },
  parse(value) {
    return JSON.parse(value);
  },
};
