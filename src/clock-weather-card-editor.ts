import { LitElement, html, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { fireEvent, type HomeAssistant } from 'custom-card-helpers'
import type { ClockWeatherCardConfig } from './types'

@customElement('clock-weather-card-editor')
export class ClockWeatherCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant
  @state() private _config?: ClockWeatherCardConfig

  public setConfig (config: ClockWeatherCardConfig): void {
    this._config = { ...config }
  }

  protected render (): TemplateResult {
    if (!this.hass || !this._config) return html``

    const schema = [
      // Core
      { name: 'entity', selector: { entity: { domain: 'weather' } } },
      { name: 'title', selector: { text: {} } },

      // Per-sensor entity picks (each can be different)
      { name: 'temperature_sensor', selector: { entity: { domain: 'sensor' } } },
      { name: 'show_humidity', selector: { boolean: {} } },
      { name: 'humidity_sensor', selector: { entity: { domain: 'sensor' } } },
      { name: 'apparent_sensor', selector: { entity: { domain: 'sensor' } } },
      { name: 'aqi_sensor', selector: { entity: { domain: 'sensor' } } },

      // Other options
      { name: 'sun_entity', selector: { entity: { domain: 'sun' } } },

      { name: 'weather_icon_type', selector: { select: { mode: 'dropdown', options: [
        { value: 'line', label: 'Line' },
        { value: 'fill', label: 'Fill' }
      ] } } },
      { name: 'animated_icon', selector: { boolean: {} } },

      { name: 'forecast_rows', selector: { number: { min: 1, max: 12, mode: 'box' } } },
      { name: 'hourly_forecast', selector: { boolean: {} } },

      { name: 'locale', selector: { text: {} } },
      { name: 'time_format', selector: { select: { mode: 'dropdown', options: [
        { value: '24', label: '24 hour' },
        { value: '12', label: '12 hour' }
      ] } } },
      { name: 'time_pattern', selector: { text: {} } },
      { name: 'date_pattern', selector: { text: {} } },

      { name: 'hide_clock', selector: { boolean: {} } },
      { name: 'hide_date', selector: { boolean: {} } },
      { name: 'hide_today_section', selector: { boolean: {} } },
      { name: 'hide_forecast_section', selector: { boolean: {} } },

      { name: 'use_browser_time', selector: { boolean: {} } },
      { name: 'time_zone', selector: { text: {} } },

      { name: 'show_decimal', selector: { boolean: {} } }
    ] as any

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `
  }

  private _valueChanged (ev: CustomEvent): void {
    const config = ev.detail.value as ClockWeatherCardConfig
    this._config = config
    fireEvent(this, 'config-changed', { config })
  }
}
