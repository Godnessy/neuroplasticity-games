const Settings = ({ settings, onBack, onUpdateSetting }) => {
    return (
        <section className="screen screen-settings active">
            <div className="settings-header">
                <button className="btn btn-back" onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                </button>
                <h2>Settings</h2>
            </div>
            <div className="settings-content">
                <div className="settings-group">
                    <h3>Accessibility</h3>
                    <div className="setting-item">
                        <label htmlFor="setting-font">Font Style</label>
                        <select 
                            id="setting-font" 
                            className="setting-select"
                            value={settings?.font || 'lexend'}
                            onChange={(e) => onUpdateSetting('font', e.target.value)}
                        >
                            <option value="lexend">Lexend (Default)</option>
                            <option value="opendyslexic">OpenDyslexic</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label htmlFor="setting-font-size">Text Size</label>
                        <select 
                            id="setting-font-size" 
                            className="setting-select"
                            value={settings?.fontSize || 'normal'}
                            onChange={(e) => onUpdateSetting('fontSize', e.target.value)}
                        >
                            <option value="normal">Normal</option>
                            <option value="large">Large</option>
                            <option value="xlarge">Extra Large</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label htmlFor="setting-contrast">High Contrast Mode</label>
                        <input 
                            type="checkbox" 
                            id="setting-contrast" 
                            className="setting-toggle"
                            checked={settings?.highContrast || false}
                            onChange={(e) => onUpdateSetting('highContrast', e.target.checked)}
                        />
                    </div>
                    <div className="setting-item">
                        <label htmlFor="setting-clock-size">Clock Size</label>
                        <select 
                            id="setting-clock-size" 
                            className="setting-select"
                            value={settings?.clockSize || 'normal'}
                            onChange={(e) => onUpdateSetting('clockSize', e.target.value)}
                        >
                            <option value="normal">Normal (300px)</option>
                            <option value="large">Large (400px)</option>
                            <option value="xlarge">Extra Large (500px)</option>
                        </select>
                    </div>
                </div>
                <div className="settings-group">
                    <h3>Input Method</h3>
                    <div className="setting-item">
                        <label htmlFor="setting-input">Preferred Input</label>
                        <select 
                            id="setting-input" 
                            className="setting-select"
                            value={settings?.inputMethod || 'text'}
                            onChange={(e) => onUpdateSetting('inputMethod', e.target.value)}
                        >
                            <option value="text">Type Time (HH:MM)</option>
                            <option value="visual">Visual Selection</option>
                            <option value="multiple">Multiple Choice</option>
                        </select>
                    </div>
                </div>
                <div className="settings-group">
                    <h3>Game Options</h3>
                    <div className="setting-item">
                        <label htmlFor="setting-audio">Audio Instructions</label>
                        <input 
                            type="checkbox" 
                            id="setting-audio" 
                            className="setting-toggle"
                            checked={settings?.audioEnabled || false}
                            onChange={(e) => onUpdateSetting('audioEnabled', e.target.checked)}
                        />
                    </div>
                    <div className="setting-item">
                        <label htmlFor="setting-timer">Show Timer</label>
                        <input 
                            type="checkbox" 
                            id="setting-timer" 
                            className="setting-toggle"
                            checked={settings?.showTimer ?? true}
                            onChange={(e) => onUpdateSetting('showTimer', e.target.checked)}
                        />
                    </div>
                    <div className="setting-item">
                        <label htmlFor="setting-numbers">Always Show Clock Numbers</label>
                        <input 
                            type="checkbox" 
                            id="setting-numbers" 
                            className="setting-toggle"
                            checked={settings?.alwaysShowNumbers || false}
                            onChange={(e) => onUpdateSetting('alwaysShowNumbers', e.target.checked)}
                        />
                    </div>
                </div>
                <div className="settings-group">
                    <h3>Theme</h3>
                    <div className="theme-options">
                        {['ocean', 'forest', 'sunset', 'lavender'].map(theme => (
                            <button
                                key={theme}
                                className={`theme-btn theme-${theme} ${settings?.theme === theme ? 'active' : ''}`}
                                data-theme={theme}
                                aria-label={`${theme} theme`}
                                onClick={() => onUpdateSetting('theme', theme)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Settings;
