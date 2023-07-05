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

            //if selector has multiple, split by comma
            if (newRule.selector.includes(',')) {
              const selectors = newRule.selector.split(',');

              selectors.forEach((selector, index) => {
                selectors[index] = `[data-ogsb] ${selector.trim()}`
              });

              newRule.selector = selectors.join(', ');
            } else {
              //add selector
              newRule.selector = `[data-ogsb] ${newRule.selector}`;
            }

            //append rule to document
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
