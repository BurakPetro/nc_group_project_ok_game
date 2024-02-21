const Select = ({ label, value, options, onChange, disabled }) => {
  return (
    <label>
      {label}
      <select value={value} onChange={onChange} disabled={disabled}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
export default Select;
