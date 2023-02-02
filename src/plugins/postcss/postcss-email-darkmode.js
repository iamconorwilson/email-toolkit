const plugin = (opts = {}) => {
  
  return {
    postcssPlugin: 'postcss-email-darkmode',
    AtRule: {
      media(atRule) {
        if (atRule.params.includes('prefers-color-scheme: dark')) {
          // for each rule inside the media query

          let prevRootRule = atRule;

          atRule.walkRules((rule) => {
            //copy the rule
            const newRule = rule.clone();

            //if rule selector contains a class, add the data-ogsc attribute
            if (newRule.selector.includes('.')) {
              newRule.selector = `[data-ogsc] ${newRule.selector}`;
            } else {
              newRule.selector = `[data-ogsb] ${newRule.selector}`;
            }

            atRule.parent.insertAfter(prevRootRule, newRule);

            prevRootRule = newRule;

          });
        }
      }
    }
  }
};

plugin.postcss = true;

export default plugin;
