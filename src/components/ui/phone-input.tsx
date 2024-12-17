import './phone-input.css'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  onBlur?: () => void
}

export function PhoneInput({ value, onChange, error, onBlur }: PhoneInputProps) {
  return (
    <div className="input-container">
      <label className="label">Phone Number</label>
      <div className="input-group">
        <select className="country-code input" defaultValue="+45">
          <option value="+45">+45</option>
          {/* Add more country codes as needed */}
        </select>
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="input phone-input"
          placeholder="Enter phone number"
        />
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  )
}

