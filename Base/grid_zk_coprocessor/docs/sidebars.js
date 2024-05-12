module.exports = {
  masterSidebar: [
    "home",
    {
      type: "category",
      label: "Introduction",
      collapsed: false,
      items: [
        "what-is-a-validator",
        "what-is-an-rpc-node",
        "faq",
        "backwards-compatibility",
      ],
    },
    {
      type: "category",
      label: "Command Line Tools",
      // collapsed: false,
      items: [
        {
          type: "autogenerated",
          dirName: "cli",
        },
      ],
    },
    {
      type: "category",
      label: "Architecture",
      // collapsed: false,
      items: [
        "architecture",
        {
          type: "category",
          label: "Clusters",
          // collapsed: false,
          items: [
            {
              type: "autogenerated",
              dirName: "clusters",
            },
          ],
        },
        {
          type: "category",
          label: "Consensus",
          // collapsed: false,
          items: [
            {
              type: "autogenerated",
              dirName: "consensus",
            },
          ],
        },
        {
          type: "category",
          label: "Runtime",
          // collapsed: false,
          items: [
            {
              type: "autogenerated",
              dirName: "runtime",
            },
          ],
        },
        {
          type: "category",
          label: "Validators",
          // collapsed: false,
          items: [
            {
              type: "autogenerated",
              dirName: "validator",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Operating a Validator",
      // collapsed: false,
      items: [
        {
          type: "autogenerated",
          dirName: "operations",
        },
      ],
    },
  ],
  proposalsSidebar: [
    {
      type: "category",
      label: "System Design Proposals",
      collapsed: false,
      items: [
        "proposals",
        {
          type: "category",
          label: "Accepted Proposals",
          collapsed: true,
          link: {
            type: "doc",
            id: "proposals/accepted-design-proposals",
          },
          items: [
            {
              type: "autogenerated",
              dirName: "proposals",
            },
          ],
        },
        {
          type: "category",
          label: "Implemented Proposals",
          collapsed: true,
          link: {
            type: "doc",
            id: "implemented-proposals/index",
          },
          items: [
            {
              type: "autogenerated",
              dirName: "implemented-proposals",
            },
          ],
        },
      ],
    },
  ],
};