import { GiDiamonds } from "react-icons/gi";

export const EmotionalFactors = ({ emotionalFactors }) => {
    return (
        <div className="mt-6 border-t border-soft pt-5">
            <h4 className="text-xs font-bold text-primary">
              Principais Fatores
            </h4>

            <div className="mt-4 space-y-3">
              {emotionalFactors.map((factor) => (
                <div key={factor} className="flex items-center gap-3">
                  <div className="flex size-5 items-center justify-center rounded-full bg-blue-100 text-secondary">
                    <GiDiamonds size={12} />
                  </div>

                  <p className="text-xs text-primary">{factor}</p>
                </div>
              ))}
            </div>
          </div>
    )
};