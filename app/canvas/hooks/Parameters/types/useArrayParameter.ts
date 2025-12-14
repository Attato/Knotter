import { Parameter, ParameterData } from '@/canvas/utils/parameters/parameter.types';
import { isArrayValue } from '@/canvas/utils/parameters/parameter.type-guards';

interface useArrayParameterProps {
    parameter: Parameter | undefined;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useArrayParameter = ({ parameter, updateParameter }: useArrayParameterProps) => {
    const handleAddArrayParameter = (newParameter: Parameter) => {
        if (!parameter) return;
        if (!isArrayValue(parameter)) return;

        const updatedArray = [...parameter.data, newParameter];

        updateParameter(parameter.id, {
            ...parameter,
            data: updatedArray,
        });
    };

    const handleRemoveArrayParameter = (parameterId: string) => {
        if (!parameter) return;
        if (!isArrayValue(parameter)) return;

        const updatedArray = parameter.data.filter((item) => item.id !== parameterId);

        updateParameter(parameter.id, {
            ...parameter,
            data: updatedArray,
        });
    };

    const handleUpdateArrayParameterName = (parameterId: string, newName: string) => {
        if (!parameter) return;
        if (!isArrayValue(parameter)) return;

        const updatedArray = parameter.data.map((item) => (item.id === parameterId ? { ...item, name: newName } : item));

        updateParameter(parameter.id, {
            ...parameter,
            data: updatedArray,
        });
    };

    const handleUpdateArrayParameterValue = (parameterId: string, newData: ParameterData) => {
        if (!parameter) return;
        if (!isArrayValue(parameter)) return;

        const updatedArray = parameter.data.map((item) => {
            if (item.id !== parameterId) return item;

            return {
                ...item,
                data: newData,
            };
        });

        updateParameter(parameter.id, {
            ...parameter,
            data: updatedArray,
        });
    };

    return {
        handleAddArrayParameter,
        handleRemoveArrayParameter,
        handleUpdateArrayParameterName,
        handleUpdateArrayParameterValue,
    };
};
