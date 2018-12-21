import {Resource} from '../models/resource';

export class StructureDefinition {
    name: string;
    slotType: string;
    sortCategory: string;
    baseBuildCost: Resource[];
    consumption: Resource[];
    production: Resource[];
}

export const STRUCTURE_LIBRARY: StructureDefinition[] = [
    // Gathering
    {
        name: 'Metal Mine',
        slotType: 'metal',
        sortCategory: 'gather',
        baseBuildCost: [new Resource('metal', 10)],
        consumption: [new Resource('power', 10)],
        production: [new Resource('metal', 1)]
    },
    {
        name: 'Rare Metal Mine',
        slotType: 'rareMetal',
        sortCategory: 'gather',
        baseBuildCost: [new Resource('metal', 100)],
        consumption: [new Resource('power', 2)],
        production: [new Resource('rareMetal', 0.2)]
    },
    {
        name: 'Silicate Quarry',
        slotType: 'silicate',
        sortCategory: 'gather',
        baseBuildCost: [new Resource('metal', 100)],
        consumption: [new Resource('power', 2)],
        production: [new Resource('silicate', 0.2)]
    },
    {
        name: 'Coal Mine',
        slotType: 'coal',
        sortCategory: 'gather',
        baseBuildCost: [new Resource('metal', 100)],
        consumption: [new Resource('power', 2)],
        production: [new Resource('hydrocarbon', 1.2)]
    },

    // Refinement
    {
        name: 'Duranium Smelter',
        slotType: 'empty',
        sortCategory: 'refine',
        baseBuildCost: [new Resource('metal', 100)],
        consumption: [new Resource('power', 2), new Resource('metal', 2), new Resource('silicate', 3)],
        production: [new Resource('duranium', 0.2)]
    },

    // Power
    {
        name: 'Combustion Power Plant',
        slotType: 'empty',
        sortCategory: 'power',
        baseBuildCost: [new Resource('metal', 100)],
        consumption: [new Resource('hydrocarbon', 1.5)],
        production: [new Resource('power', 10)]
    },

    // Outpost
    {
        name: 'Temperate Outpost',
        slotType: 'outpost',
        sortCategory: 'outpost',
        baseBuildCost: [new Resource('metal', 100)],
        consumption: [],
        production: [new Resource('power', 5)]
    }
];
