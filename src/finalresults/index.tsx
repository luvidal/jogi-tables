import EditableCell from '../common/editablecell'
import { displayCurrencyCompact } from '../common/utils'
import { T } from '../common/styles'

export interface FinalResultsValues {
    renta_liquida_ajustada_comprador?: number | null
    renta_liquida_ajustada_codeudor?: number | null
    /** Array of adjusted incomes for multiple codeudores (codeudor1, codeudor2, etc.) */
    rentas_codeudores?: (number | null)[]
    total_rentas?: number | null
    dividendo_hipotecario?: number | null
    indice_carga_hipotecaria?: number | null
    indice_carga_financiera_conjunta?: number | null
    evaluacion_realizada_por?: string
}

export interface CodeudorIncomeInfo {
    name: string
    calculatedIncome: number
}

export interface PromptOptions {
    message: string
    title?: string
    defaultValue?: string
    type?: 'text' | 'number'
    icon?: string
}

export interface FinalResultsCompactProps {
    values: FinalResultsValues
    onChange: (key: string, value: number | string | null | (number | null)[]) => void
    calculatedDebtorIncome?: number
    /** @deprecated Use codeudorIncomes array instead */
    calculatedCodebtorIncome?: number
    /** Array of codeudor income info (name + calculated income) */
    codeudorIncomes?: CodeudorIncomeInfo[]
    calculatedDebts?: number
    /** Prompt function for editing index values. If not provided, indices are display-only. */
    prompt?: (options: PromptOptions) => Promise<string | null>
}

const formatCurrency = (value: number | null | undefined): string => {
    return displayCurrencyCompact(value)
}

const RiskBadge = ({ value, thresholds }: { value: number | null | undefined, thresholds: { warning: number, danger: number } }) => {
    if (value === null || value === undefined) return null

    let badgeClass = 'bg-emerald-100 text-emerald-700'
    let badgeText = 'OK'

    if (value >= thresholds.danger) {
        badgeClass = 'bg-red-100 text-red-700'
        badgeText = 'Alto'
    } else if (value >= thresholds.warning) {
        badgeClass = 'bg-amber-100 text-amber-700'
        badgeText = 'Medio'
    }

    return (
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${badgeClass}`}>
            {badgeText}
        </span>
    )
}

const FinalResultsCompact = ({
    values,
    onChange,
    calculatedDebtorIncome = 0,
    calculatedCodebtorIncome = 0,
    codeudorIncomes = [],
    calculatedDebts = 0,
    prompt,
}: FinalResultsCompactProps) => {
    const debtorIncome = values.renta_liquida_ajustada_comprador ?? (calculatedDebtorIncome > 0 ? Math.round(calculatedDebtorIncome) : null)

    // Support multiple codeudores - use array if provided, otherwise fall back to single codeudor
    const hasMultipleCodes = codeudorIncomes.length > 0
    const codeudorIncomesAdjusted = hasMultipleCodes
        ? codeudorIncomes.map((c, idx) => values.rentas_codeudores?.[idx] ?? (c.calculatedIncome > 0 ? Math.round(c.calculatedIncome) : null))
        : [values.renta_liquida_ajustada_codeudor ?? (calculatedCodebtorIncome > 0 ? Math.round(calculatedCodebtorIncome) : null)]

    const totalCodeudorIncome = codeudorIncomesAdjusted.reduce<number>((sum, v) => sum + (v ?? 0), 0)
    const calculatedTotal = (debtorIncome ?? 0) + totalCodeudorIncome
    const displayTotal = values.total_rentas ?? calculatedTotal

    const dividendo = values.dividendo_hipotecario ?? 0
    const totalDebts = calculatedDebts

    const autoCalculatedCH = displayTotal > 0 ? Math.round((dividendo / displayTotal) * 10000) / 100 : 0
    const autoCalculatedCF = displayTotal > 0 ? Math.round(((dividendo + totalDebts) / displayTotal) * 10000) / 100 : 0

    const displayCH = values.indice_carga_hipotecaria ?? (autoCalculatedCH > 0 ? autoCalculatedCH : null)
    const displayCF = values.indice_carga_financiera_conjunta ?? (autoCalculatedCF > 0 ? autoCalculatedCF : null)

    const handleEditCH = prompt ? async () => {
        const newVal = await prompt({ message: 'Carga Hipotecaria (%)', title: 'Editar índice', defaultValue: displayCH?.toString() || '', type: 'number', icon: 'Percent' })
        if (newVal !== null) {
            const parsed = parseFloat(newVal)
            onChange('indice_carga_hipotecaria', isNaN(parsed) ? null : parsed)
        }
    } : undefined

    const handleEditCF = prompt ? async () => {
        const newVal = await prompt({ message: 'Carga Financiera Total (%)', title: 'Editar índice', defaultValue: displayCF?.toString() || '', type: 'number', icon: 'Percent' })
        if (newVal !== null) {
            const parsed = parseFloat(newVal)
            onChange('indice_carga_financiera_conjunta', isNaN(parsed) ? null : parsed)
        }
    } : undefined

    const clickableClass = prompt ? 'cursor-pointer hover:underline' : ''

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Rentas */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Rentas Líquidas
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className={T.muted}>Comprador</span>
                        <EditableCell
                            value={debtorIncome}
                            onChange={(v) => {
                                onChange('renta_liquida_ajustada_comprador', v as number | null)
                                const newTotal = ((v as number | null) ?? 0) + totalCodeudorIncome
                                onChange('total_rentas', newTotal > 0 ? newTotal : null)
                            }}
                            type="currency"
                            width="120px"
                            className={`text-emerald-700 ${T.cardValue}`}
                            asDiv
                        />
                    </div>

                    {/* Render codeudor rows dynamically */}
                    {hasMultipleCodes ? (
                        codeudorIncomes.map((codeudor, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className={`${T.muted} truncate max-w-[120px]`} title={codeudor.name}>
                                    {codeudorIncomes.length > 1 ? `Codeudor ${idx + 1}` : 'Codeudor'}
                                </span>
                                <EditableCell
                                    value={codeudorIncomesAdjusted[idx]}
                                    onChange={(v) => {
                                        const newCodeudorIncomes = [...codeudorIncomesAdjusted]
                                        newCodeudorIncomes[idx] = v as number | null
                                        onChange('rentas_codeudores', newCodeudorIncomes)
                                        const newTotal = (debtorIncome ?? 0) + newCodeudorIncomes.reduce<number>((sum, val) => sum + (val ?? 0), 0)
                                        onChange('total_rentas', newTotal > 0 ? newTotal : null)
                                    }}
                                    type="currency"
                                    width="120px"
                                    className={`text-emerald-700 ${T.cardValue}`}
                                    asDiv
                                />
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-between">
                            <span className={T.muted}>Codeudor</span>
                            <EditableCell
                                value={codeudorIncomesAdjusted[0]}
                                onChange={(v) => {
                                    onChange('renta_liquida_ajustada_codeudor', v as number | null)
                                    const newTotal = (debtorIncome ?? 0) + ((v as number | null) ?? 0)
                                    onChange('total_rentas', newTotal > 0 ? newTotal : null)
                                }}
                                type="currency"
                                width="120px"
                                className={`text-emerald-700 ${T.cardValue}`}
                                asDiv
                            />
                        </div>
                    )}

                    <div className="border-t border-emerald-300 pt-2 mt-2 flex items-center justify-between">
                        <span className={`${T.footerLabel} text-emerald-800 text-xs`}>TOTAL</span>
                        <span className={`text-emerald-800 ${T.footerValue}`}>
                            {formatCurrency(displayTotal > 0 ? displayTotal : null)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Column 2: Obligaciones */}
            <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    Obligaciones
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className={T.muted}>Dividendo</span>
                        <EditableCell
                            value={values.dividendo_hipotecario}
                            onChange={(v) => onChange('dividendo_hipotecario', v as number | null)}
                            type="currency"
                            width="120px"
                            className={`text-sky-700 ${T.cardValue}`}
                            asDiv
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={T.muted}>Deudas</span>
                        <span className={`text-orange-600 ${T.cardValue}`}>
                            {formatCurrency(totalDebts > 0 ? totalDebts : null)}
                        </span>
                    </div>

                    <div className="border-t border-sky-300 pt-2 mt-2 flex items-center justify-between">
                        <span className={`${T.footerLabel} text-sky-800 text-xs`}>TOTAL</span>
                        <span className={`text-sky-800 ${T.footerValue}`}>
                            {formatCurrency((dividendo + totalDebts) > 0 ? dividendo + totalDebts : null)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Column 3: Índices */}
            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                <div className="text-xs font-semibold text-violet-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Índices de Carga
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className={T.muted}>Hipotecaria</span>
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-violet-700 ${T.cardValue} ${clickableClass}`}
                                onClick={handleEditCH}
                            >
                                {displayCH !== null && displayCH !== undefined ? `${displayCH}%` : '—'}
                            </span>
                            <RiskBadge value={displayCH} thresholds={{ warning: 25, danger: 35 }} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={T.muted}>Financiera</span>
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-violet-700 ${T.cardValue} ${clickableClass}`}
                                onClick={handleEditCF}
                            >
                                {displayCF !== null && displayCF !== undefined ? `${displayCF}%` : '—'}
                            </span>
                            <RiskBadge value={displayCF} thresholds={{ warning: 40, danger: 50 }} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default FinalResultsCompact
