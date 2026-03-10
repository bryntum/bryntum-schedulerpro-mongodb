import {
    DateHelper,
    EventModel,
    ProjectModel,
    StringHelper,
    type ProjectModelConfig,
    type ResourceUtilizationConfig,
    type SchedulerEventModel,
    type SchedulerProConfig
} from '@bryntum/schedulerpro';

class BookingModel extends EventModel {
    static override fields = [
        { name : 'bookingCategory', type : 'string' },
        { name : 'host', type : 'string' },
        { name : 'team', type : 'string' },
        { name : 'attendees', type : 'number' },
        { name : 'notes', type : 'string' }
    ];
}

const bookingColors: Record<string, string> = {
    Meeting   : '#ea6d4f',
    Desk      : '#267b8a',
    Coworking : '#d69a27'
};

export const workspaceTypeOptions = [
    { value : 'all', text : 'All types' },
    { value : 'Meeting room', text : 'Meeting room' },
    { value : 'Desk bank', text : 'Desk bank' },
    { value : 'Coworking lounge', text : 'Coworking lounge' }
] as const;

export const neighborhoodOptions = [
    { value : 'all', text : 'All neighborhoods' },
    { value : 'Docklands', text : 'Docklands' },
    { value : 'Atrium North', text : 'Atrium North' },
    { value : 'Harbor Wing', text : 'Harbor Wing' }
] as const;

export const filterState = {
    workspaceType : 'all',
    neighborhood  : 'all'
};

export const projectConfig: Partial<ProjectModelConfig> = {
    eventModelClass : BookingModel,
    calendar        : 'workspace-hours',
    transport : {
        load : {
            url : '/api/load'
        },
        sync : {
            url : '/api/sync'
        }
    },
    autoLoad         : true,
    autoSync         : true,
    validateResponse : true
};

export const project = new ProjectModel(projectConfig);

export const schedulerConfig: Partial<SchedulerProConfig> = {
    appendTo   : 'scheduler',
    project,
    startDate  : '2026-03-16T07:00:00',
    endDate    : '2026-03-18T20:00:00',
    viewPreset : 'hourAndDay',
    rowHeight  : 62,
    barMargin  : 7,
    multiEventSelect : true,
    columns          : [
        {
            type  : 'resourceInfo',
            text  : 'Workspace',
            field : 'name',
            width : 240
        },
        {
            text  : 'Type',
            field : 'workspaceType',
            width : 145
        },
        {
            text  : 'Neighborhood',
            field : 'neighborhood',
            width : 150
        },
        {
            text  : 'Floor',
            field : 'floor',
            width : 90
        },
        {
            text   : 'Capacity',
            field  : 'capacity',
            width  : 100,
            align  : 'center',
            editor : false
        }
    ],
    features : {
        dependencies : true,
        eventMenu    : true,
        taskEdit     : {
            editorConfig : {
                title : 'Reservation',
                width : '36em'
            },
            items : {
                generalTab : {
                    title : 'Booking details',
                    items : {
                        resourcesField : {
                            label : 'Workspace'
                        },
                        bookingCategory : {
                            type     : 'combo',
                            name     : 'bookingCategory',
                            label    : 'Booking type',
                            editable : false,
                            items    : ['Meeting', 'Desk', 'Coworking'],
                            weight   : 210
                        },
                        host : {
                            type   : 'text',
                            name   : 'host',
                            label  : 'Host',
                            weight : 220
                        },
                        team : {
                            type   : 'text',
                            name   : 'team',
                            label  : 'Team',
                            weight : 230
                        },
                        attendees : {
                            type   : 'number',
                            name   : 'attendees',
                            label  : 'Attendees',
                            min    : 1,
                            weight : 240
                        },
                        notes : {
                            type   : 'text',
                            name   : 'notes',
                            label  : 'Notes',
                            weight : 250
                        }
                    }
                }
            }
        }
    },
    eventRenderer({ eventRecord, renderData }) {
        renderData.eventColor = bookingColors[eventRecord.get('bookingCategory')] || '#1d5b52';

        return {
            children : [
                {
                    className : 'booking-title',
                    text      : eventRecord.name
                },
                {
                    className : 'booking-meta',
                    text      : `${eventRecord.get('host') || 'TBD'} | ${eventRecord.get('attendees') || 0} seats`
                }
            ]
        };
    }
};

export const utilizationConfig: Partial<ResourceUtilizationConfig> = {
    appendTo    : 'utilization',
    project,
    hideHeaders : true,
    rowHeight   : 44,
    showBarTip  : true,
    showBarText : true,
    features    : {
        nonWorkingTime : false
    },
    columns : [
        {
            type  : 'tree',
            text  : 'Resource / booking',
            field : 'name',
            flex  : 1
        }
    ]
};