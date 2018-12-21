import {Resource} from '../models/resource';

export class ResearchDefinition {
    name: string;
    prerequisite: string;
    cost: number;
}

export const RESEARCH_LIBRARY: ResearchDefinition[] = [
    {
        name: 'Alloys',
        prerequisite: null,
        cost: 10
    },
    {
        name: 'Electronics',
        prerequisite: 'Alloys',
        cost: 15
    },
    {
        name: 'Longrange Sensing',
        prerequisite: 'Electronics',
        cost: 15
    },
    {
        name: 'Photovoltaic Energy Systems',
        prerequisite: 'Electronics',
        cost: 30
    },
    {
        name: 'Nullpressure Adaptation',
        prerequisite: 'Photovoltaic Energy Systems',
        cost: 30
    },
    {
        name: 'Artificial Satellites',
        prerequisite: 'Photovoltaic Energy Systems',
        cost: 30
    },
    {
        name: 'Elementary Fission',
        prerequisite: 'Nullpressure Adaptation',
        cost: 30
    },
    {
        name: 'Nanomaterials',
        prerequisite: 'Nullpressure Adaptation',
        cost: 30
    },
];
