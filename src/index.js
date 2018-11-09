import React, {Component} from 'react'
import PropTypes from 'prop-types';

class ReactNumber extends Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
        this.onInputType = this.onInputType.bind(this);
        this.formattedRawValue = this.formattedRawValue.bind(this);
        this.getRawValue = this.getRawValue.bind(this);
        this.onClick = this.onClick.bind(this);

        this.state = {
            rawValue: this.props.value,
            tabIndex: this.props.tabIndex,
            readOnly: this.props.readOnly
        }
    }

    onInputType(event) {
        const input = event.target.value;
        let rawValue = this.getRawValue(input);
        if (!rawValue) {
            rawValue = 0
        }

        this.notifyParentWithRawValue(rawValue);

        this.setState({
            rawValue
        })
    }

    notifyParentWithRawValue(rawValue) {
        let display = this.formattedRawValue(rawValue);
        this.props.onChange(rawValue, display)
    }

    getRawValue(displayedValue) {
        let result = displayedValue;

        result = removeOccurrences(result, this.props.delimiter);
        result = removeOccurrences(result, this.props.separator);
        result = removeOccurrences(result, this.props.unit);

        let intValue = Number(result);

        if (intValue < Number.MAX_SAFE_INTEGER + 1) {
            return intValue
        }

        return this.state.rawValue;
    }

    formattedRawValue(rawValue) {
        const minChars = '0'.length + this.props.precision;

        let result = `${rawValue}`;

        if (result.length < minChars) {
            const leftZeroesToAdd = minChars - result.length;
            result = `${repeatZeroes(leftZeroesToAdd)}${result}`;
        }

        let beforeSeparator = result.slice(0, result.length - this.props.precision);
        let afterSeparator = result.slice(result.length - this.props.precision);

        if (beforeSeparator.length > 3) {
            const chars = beforeSeparator.split('').reverse();
            let withDots = '';
            for (let i = chars.length - 1; i >= 0; i--) {
                let char = chars[i];
                let dot = i % 3 === 0 ? this.props.delimiter : '';
                withDots = `${withDots}${char}${dot}`;
            }
            withDots = withDots.substring(0, withDots.length - 1);
            beforeSeparator = withDots
        }
        result = beforeSeparator + this.props.separator + afterSeparator;

        if (this.props.unit) {
            result = `${this.props.unit} ${result}`;
        }

        return result;
    }

    onClick() {
        const {rawValue} = this.state;
        const len = this.formattedRawValue(rawValue).length * 2;

        setTimeout(() => {
            const element = this.inputRef.current;
            element.setSelectionRange(len, len);
        }, 10);
    }

    render() {
        return (
            <input
                ref={this.inputRef}
                id={this.props.id}
                className={this.props.className}
                onBlur={this.props.onBlur}
                onFocus={this.props.onFocus}
                onClick={this.onClick}
                onChange={this.onInputType}
                onKeyUp={this.props.onKeyUp}
                onKeyPress={this.props.onKeyPress}
                value={this.formattedRawValue(this.state.rawValue)}
                disabled={this.props.disabled}
                autoFocus={this.props.autoFocus}
                tabIndex={this.state.tabIndex}
                readOnly={this.state.readOnly}
                autoComplete={this.props.autoComplete}
                autoCorrect={this.props.autoCorrect}
                name={this.props.name}
                placeholder={this.props.placeholder}
            />
        )
    }
}

const repeatZeroes = (times) => {
    let result = '';

    for (let i = 0; i < times; i++) {
        result += '0'
    }

    return result
};

const removeOccurrences = (from, toRemove) => {
    toRemove = toRemove.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const re = new RegExp(toRemove, 'g');
    return from.replace(re, '');
};

ReactNumber.propTypes = {
    id: PropTypes.string,
    autoFocus: PropTypes.bool,
    delimiter: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyUp: PropTypes.func,
    onKeyPress: PropTypes.func,
    precision: PropTypes.number,
    readOnly: PropTypes.bool,
    separator: PropTypes.string,
    tabIndex: PropTypes.number,
    unit: PropTypes.string,
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
};

ReactNumber.defaultProps = {
    value: 0,
    precision: 2,
    separator: '.',
    delimiter: ',',
    unit: '',
    disabled: false,
    autoFocus: false,
    className: '',
    onChange: () => {
    },
    onBlur: () => {
    },
    onFocus: () => {
    },
    onKeyUp: () => {
    },
    onKeyPress: () => {
    },
};

export default ReactNumber