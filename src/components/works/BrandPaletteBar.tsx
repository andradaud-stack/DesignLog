import React, { useState } from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import { getWorkColorPalette, type ColorSwatch } from '../../utils/paletteUtils';
import { useWorks } from '../../context/WorksContext';

interface BrandPaletteBarProps {
  hotelId: string;
  categoryId: string;
}

export const BrandPaletteBar: React.FC<BrandPaletteBarProps> = ({ hotelId, categoryId }) => {
  const { showToast } = useWorks();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const swatches: ColorSwatch[] = getWorkColorPalette(hotelId, categoryId);

  const handleCopyColor = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${name} (${hex}) to clipboard!`, 'success');
    setTimeout(() => {
      setCopiedHex(null);
    }, 2000);
  };

  const handleCopyAllCss = () => {
    const cssVars = swatches
      .map((s) => `  --color-${s.role}: ${s.hex}; /* ${s.name} */`)
      .join('\n');
    const output = `:root {\n${cssVars}\n}`;
    navigator.clipboard.writeText(output);
    showToast('Copied full palette CSS variables to clipboard!', 'success');
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-electric-500" />
          <span className="text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider">
            Brand Color Hierarchy
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            (Click swatch to copy HEX)
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyAllCss}
          className="text-[11px] font-mono text-electric-600 dark:text-electric-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <Copy className="w-3 h-3" />
          <span>Copy CSS Vars</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {swatches.map((swatch) => {
          const isCopied = copiedHex === swatch.hex;
          return (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => handleCopyColor(swatch.hex, swatch.name)}
              className="group relative flex flex-col items-start p-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-navy-800 hover:border-electric-500/50 hover:shadow-md transition-all text-left"
            >
              {/* Color swatch square */}
              <div
                className="w-full h-8 rounded-lg shadow-inner relative flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: swatch.hex }}
              >
                {isCopied && (
                  <span className="w-5 h-5 rounded-full bg-white/90 text-emerald-600 flex items-center justify-center shadow-md animate-scale-in">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Label */}
              <div className="mt-1.5 w-full">
                <span className="text-[10px] font-bold text-navy-950 dark:text-white block truncate">
                  {swatch.name}
                </span>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">
                  {swatch.hex}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
