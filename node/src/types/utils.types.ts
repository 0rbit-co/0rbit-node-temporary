interface Tag {
    name: string;
    value: string;
}

interface Node {
    id: string;
    block: any; // Adjust type as needed
    tags: Tag[];
    bundledIn: { id: string };
}


export interface Edge {
    cursor: string;
    node: Node;
}

export interface StructuredEdge {
    id: string;
    block: any; // Adjust type as needed
    tags: { [key: string]: string };
    bundledIn: { id: string };
}

export interface GroupedEdge {
    [key: string]: StructuredEdge[]
}