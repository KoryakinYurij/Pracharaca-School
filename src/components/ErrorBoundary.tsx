import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { t } from '../locales'

type ErrorBoundaryVariant = 'page' | 'inline'

interface Props {
  children?: ReactNode
  variant?: ErrorBoundaryVariant
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public override render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.variant === 'inline') {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-amber-600/20 bg-amber-50/50 px-3 py-2 text-sm text-graphite/70">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600/60" aria-hidden="true" />
          <span>{t('error.sectionRender')}</span>
          <button
            type="button"
            onClick={this.handleRetry}
            className="ml-auto text-xs font-medium text-gold-dark underline decoration-gold/30 underline-offset-2 hover:decoration-gold"
          >
            {t('error.retry')}
          </button>
          {import.meta.env.DEV && this.state.error && (
            <span className="ml-2 font-mono text-xs text-graphite/40 line-clamp-1">
              {this.state.error.message}
            </span>
          )}
        </div>
      )
    }

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="w-full max-w-md rounded-[2rem] border border-gold/30 bg-ivory/95 p-8 shadow-card backdrop-blur-md sm:p-12">
          <h1 className="mb-4 font-display text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">
            <AlertCircle className="mr-2 inline-block h-7 w-7 text-gold" />
            {t('error.title')}
          </h1>

          <p className="mb-8 font-body text-graphite/70">
            {t('error.description')}
          </p>

          <button
            type="button"
            onClick={this.handleReload}
            className="group inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white px-8 py-3 font-body text-sm font-medium text-gold-dark transition-all duration-300 hover:bg-gold hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold/50 active:scale-95"
          >
            <RefreshCw size={18} className="transition-transform duration-500 group-hover:rotate-180" />
            {t('error.reload')}
          </button>

          {import.meta.env.DEV && this.state.error && (
            <div className="mt-8 overflow-hidden rounded-xl border border-border bg-black/5 p-4 text-left">
              <p className="font-mono text-xs text-graphite/60 line-clamp-3">
                {this.state.error.toString()}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
}
