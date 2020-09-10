import { IReferences } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { SequenceTransferProcess } from './SequenceTransferProcess';
import { BatchesPollGenerator } from '../generators/BatchesPollGenerator';
import { GeneratorParam } from '../generators/GeneratorParam';
import { ChangesTransferParam } from './ChangesTransferParam';

export class BatchesSequenceTransferProcess<T, K> extends SequenceTransferProcess<T, K>
{
    public constructor(workflowType: string, references: IReferences, parameters: Parameters) {
        super(workflowType, references, parameters);

        // this sub-class uses _pollAdapter from the SequenceTransferWorkflow class and it is required here
        if (this._pollAdapter == null)
            throw new Error('PollAdapter is not defined or doesn\'t implement IReadWrite client interface');

        this._generator = new BatchesPollGenerator<T, K>(
            this.processType,
            this._transferQueues[0],
            this._references,
            Parameters.fromTuples(
                GeneratorParam.MessageType, this.processType + '.Change',
                ChangesTransferParam.PollAdapter, this._pollAdapter
            ).override(this.parameters)
        );

    }
}