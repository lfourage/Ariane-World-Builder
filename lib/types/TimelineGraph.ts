interface EventNode {
    id: string;
    data: JSON;
    nexts: string[];
}

export class TimelineGraph {
    private nodes: Map<string, EventNode>;

    constructor(fetchedEvents: fetchedEvents[]){
        this.nodes = new Map();
        this.buildFromFetchedEvents(fetchedEvents);
    }

    private buildFromFetchedEvents(fetchedEvents: fetchedEvents[]){
        fetchedEvents.forEach((fetchedEvent) => {
            this.nodes.set(fetchedEvent.id, {
                id: fetchedEvent.id,
                data: fetchedEvent.data,
                nexts: fetchedEvent.nexts
                .sort((a: any, b: any) => a.order - b.order)
                .map((next: any) => next.id),
            })
        })
    }
}
