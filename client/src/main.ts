import { Combo } from '@bryntum/core-enterprise';
import {
    ResourceUtilization,
    Scheduler,
} from '@bryntum/scheduler-enterprise';
import './style.css';
import {
    filterState,
    neighborhoodOptions,
    project,
    schedulerConfig,
    utilizationConfig,
    workspaceTypeOptions
} from './schedulerProConfig';

const scheduler = new Scheduler({
    ...schedulerConfig,
    tbar : [
        {
            type         : 'combo',
            ref          : 'workspaceTypeFilter',
            width        : 190,
            editable     : false,
            value        : filterState.workspaceType,
            valueField   : 'value',
            displayField : 'text',
            items        : workspaceTypeOptions,
            placeholder  : 'Workspace type',
            listeners    : {
                change({ value }: { value: string }) {
                    filterState.workspaceType = value || 'all';
                    applyResourceFilters();
                }
            }
        },
        {
            type         : 'combo',
            ref          : 'neighborhoodFilter',
            width        : 205,
            editable     : false,
            value        : filterState.neighborhood,
            valueField   : 'value',
            displayField : 'text',
            items        : neighborhoodOptions,
            placeholder  : 'Neighborhood',
            listeners    : {
                change({ value }: { value: string }) {
                    filterState.neighborhood = value || 'all';
                    applyResourceFilters();
                }
            }
        },
        {
            type     : 'button',
            icon     : 'b-icon-undo',
            text     : 'Reset filters',
            onAction : () => {
                filterState.workspaceType = 'all';
                filterState.neighborhood = 'all';
                (scheduler.widgetMap.workspaceTypeFilter as Combo).value = 'all';
                (scheduler.widgetMap.neighborhoodFilter as Combo).value = 'all';
                applyResourceFilters();
            }
        },
        {
            type     : 'button',
            icon     : 'b-icon-search-plus',
            text     : 'Zoom in',
            onAction : () => scheduler.zoomIn()
        },
        {
            type     : 'button',
            icon     : 'b-icon-search-minus',
            text     : 'Zoom out',
            onAction : () => scheduler.zoomOut()
        }
    ]
});

new ResourceUtilization({
    ...utilizationConfig,
    partner : scheduler
});

function applyResourceFilters(): void {
    const selectedType = filterState.workspaceType;
    const selectedNeighborhood = filterState.neighborhood;

    scheduler.resourceStore.filter({
        filters : (resource: Record<string, unknown>) => {
            const matchesType = selectedType === 'all' || resource.workspaceType === selectedType;
            const matchesNeighborhood = selectedNeighborhood === 'all' || resource.neighborhood === selectedNeighborhood;

            return matchesType && matchesNeighborhood;
        },
        replace : true
    });
}

project.on({
    load() {
        applyResourceFilters();
    }
});