/**
 * Fictional catalog data for the MJ's Rock Shop teaching prototype.
 *
 * Missing characteristics are intentional so students can test how the UI
 * handles information that MJ has not recorded yet.
 */
let products = [
  {
    id: "rose-quartz-point",
    name: "Rose Quartz Point",
    description: "A soft pink, translucent crystal with natural facets.",
    price: 18.00,
    image: "assets/products/rose-quartz.jpg",
    imageAlt: "A polished pale pink rose quartz crystal point",
    available: true,
    popular: true,
    // popular: false,
    color: "pink",
    tags: ["pink", "crystal", "gift", "beginner"],
    geologicalType: "igneous",
    isMineral: true,
    condition: "polished",
    safetyWarning: "Do not use this specimen as a food or drink container.",
    handlingWarning: "The pointed top may be sharp. Handle carefully.",
    shipping: {
      USPS: ["Ground", "Priority"],
      UPS: ["Ground"]
    }
  },
  {
    id: "amethyst-cluster",
    name: "Amethyst Cluster",
    description: "A purple crystal cluster with sparkling points and a dark base.",
    price: 32.00,
    image: "assets/products/amethyst.jpg",
    imageAlt: "A purple amethyst crystal cluster on a dark stone base",
    available: true,
    popular: true,
    // popular: false,    
    color: "purple",
    tags: ["purple", "crystal", "sparkle", "gift"],
    geologicalType: "igneous",
    isMineral: true,
    condition: "raw",
    safetyWarning: null,
    handlingWarning: "Crystal points can be delicate and may break if dropped.",
    shipping: {
      USPS: ["Ground", "Priority"],
      UPS: ["Ground", "Priority"]
    }
  },
  {
    id: "basalt-study-stone",
    name: "Basalt Study Stone",
    description: "A dark, rough volcanic rock for a classroom collection or project.",
    price: 9.00,
    image: "assets/products/basalt.jpg",
    imageAlt: "A rough charcoal-black basalt volcanic rock",
    available: true,
    popular: false,
    color: "black",
    tags: ["black", "dark", "volcanic", "project", "beginner"],
    geologicalType: "igneous",
    isMineral: false,
    condition: "raw",
    safetyWarning: null,
    handlingWarning: null,
    shipping: {
      USPS: ["Ground"],
      UPS: ["Ground"]
    }
  },
  {
    id: "red-jasper-palm-stone",
    name: "Red Jasper Palm Stone",
    description: "A smooth, polished stone with warm red and cream bands.",
    price: 14.00,
    image: "assets/products/red-jasper.jpg",
    imageAlt: "A smooth polished red jasper stone with cream bands",
    available: true,
    popular: false,
    color: "red",
    tags: ["red", "cream", "smooth", "palm stone", "gift"],
    geologicalType: "metamorphic",
    isMineral: false,
    condition: "polished",
    safetyWarning: null,
    handlingWarning: null,
    shipping: {
      USPS: ["Ground", "Priority"],
      UPS: ["Ground"]
    }
  },
  {
    id: "pyrite-cube-matrix",
    name: "Pyrite Cube Matrix",
    description: "Reflective gold-colored cubic crystals on a dark natural matrix.",
    price: 27.00,
    image: "assets/products/pyrite.jpg",
    imageAlt: "A raw pyrite specimen with metallic gold cubes on dark rock",
    available: true,
    popular: false,
    color: "gold",
    tags: ["gold", "metallic", "cubes", "collector"],
    geologicalType: "sedimentary",
    isMineral: true,
    condition: "raw",
    safetyWarning: "Wash hands after handling and keep away from food preparation areas.",
    handlingWarning: "Small crystal edges may be sharp.",
    shipping: {
      USPS: ["Priority"],
      UPS: ["Ground", "Priority"]
    }
  },
  {
    id: "layered-sandstone",
    name: "Layered Sandstone",
    description: "A tan sedimentary specimen with visible layers and a natural crack.",
    price: 11.00,
    image: "assets/products/sandstone.jpg",
    imageAlt: "A rough tan sandstone specimen with horizontal layers",
    available: false,
    popular: false,
    color: null,
    tags: ["tan", "layers", "sedimentary", "project"],
    geologicalType: "sedimentary",
    isMineral: false,
    condition: "raw",
    safetyWarning: null,
    handlingWarning: "This specimen has a significant crack and may break during handling.",
    shipping: {
      USPS: [],
      UPS: []
    }
  },
  {
    id: "amazonite-block",
    name: "Amazonite Block",
    description: "A blue-green mineral specimen with blocky crystal faces and calm ocean color.",
    price: 24.00,
    image: "assets/products/amazonite.jpg",
    imageAlt: "A blue-green amazonite mineral specimen with blocky crystal faces",
    available: true,
    popular: false,
    color: "blue-green",
    tags: ["blue", "green", "teal", "crystal", "collector"],
    geologicalType: "igneous",
    isMineral: true,
    condition: "raw",
    safetyWarning: null,
    handlingWarning: null,
    shipping: {
      USPS: ["Ground", "Priority"],
      UPS: ["Ground", "Priority"]
    }
  },
  {
    id: "tigers-eye-palm-stone",
    name: "Tiger's Eye Palm Stone",
    description: "A smooth golden-brown stone with bands that shimmer as it moves in the light.",
    price: 16.00,
    image: "assets/products/tigers-eye.jpg",
    imageAlt: "A smooth polished golden-brown tiger's eye palm stone",
    available: true,
    popular: true,
    color: "brown",
    tags: ["gold", "brown", "amber", "smooth", "palm stone", "gift"],
    geologicalType: "metamorphic",
    isMineral: true,
    condition: "polished",
    safetyWarning: null,
    handlingWarning: null,
    shipping: {
      USPS: ["Ground", "Priority"],
      UPS: ["Ground"]
    }
  },
  {
    id: "green-aventurine",
    name: "Green Aventurine",
    description: "A raw green stone with a mottled surface and tiny sparkling inclusions.",
    price: 13.00,
    image: "assets/products/aventurine.jpg",
    imageAlt: "A rough green aventurine stone with small sparkling inclusions",
    available: true,
    popular: false,
    color: "green",
    tags: ["green", "sparkle", "natural", "beginner"],
    geologicalType: null,
    isMineral: null,
    condition: "raw",
    safetyWarning: null,
    handlingWarning: null,
    shipping: {
      USPS: ["Ground"],
      UPS: ["Ground"]
    }
  },
  {
    id: "obsidian-arrowhead",
    name: "Obsidian Arrowhead",
    description: "A glossy black volcanic glass specimen shaped by natural-looking facets.",
    price: 21.00,
    image: "assets/products/obsidian.jpg",
    imageAlt: "A glossy black obsidian volcanic glass specimen with pointed facets",
    available: true,
    popular: false,
    color: "black",
    tags: ["black", "volcanic", "glass", "collector"],
    geologicalType: "igneous",
    isMineral: false,
    condition: "raw",
    safetyWarning: "The edges may be sharp. Do not use this specimen as a tool or toy.",
    handlingWarning: "Handle with care because the volcanic glass can chip or cut.",
    shipping: {
      USPS: ["Priority"],
      UPS: ["Ground", "Priority"]
    }
  },
  {
    id: "septarian-nodule",
    name: "Septarian Nodule",
    description: "A cut nodule with mustard-yellow mineral pockets inside a dark patterned matrix.",
    price: 29.00,
    image: "assets/products/septarian.jpg",
    imageAlt: "A cut septarian nodule with yellow pockets and a dark brown matrix",
    available: true,
    popular: false,
    color: "yellow",
    tags: ["yellow", "brown", "patterned", "nodule", "collector"],
    geologicalType: "sedimentary",
    isMineral: false,
    condition: "polished",
    safetyWarning: null,
    handlingWarning: "The cut edge is uneven. Support the specimen with both hands.",
    shipping: {
      USPS: ["Priority"],
      UPS: ["Ground", "Priority"]
    }
  },
  {
    id: "selenite-wand",
    name: "Selenite Wand",
    description: "A delicate translucent crystal wand with soft white layered fibers.",
    price: 19.00,
    image: "assets/products/selenite.jpg",
    imageAlt: "A translucent white selenite crystal wand with layered fibers",
    available: true,
    popular: false,
    color: "white",
    tags: ["white", "translucent", "crystal", "wand", "gift"],
    geologicalType: "sedimentary",
    isMineral: true,
    condition: "raw",
    safetyWarning: "Do not place this specimen in water or use it with food.",
    handlingWarning: "Selenite is soft and can scratch, flake, or break easily.",
    shipping: {
      USPS: ["Priority"],
      UPS: []
    }
  }
];

// products = [];

// These values give students repeatable inputs for the future mock checkout.
const mockCheckoutScenarios = {
  successCode: "4242 4242 4242 4242",
  declineCode: "4000 0000 0000 0002",
  invalidCode: "1234"
};
