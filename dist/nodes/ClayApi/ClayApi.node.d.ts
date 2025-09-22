import { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class ClayApi implements INodeType {
    description: INodeTypeDescription;
    loadOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=ClayApi.node.d.ts.map