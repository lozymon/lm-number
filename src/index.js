import React, {Component} from 'react'
import PropTypes from 'prop-types';

class LmNumber extends Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
        this.onInputType = this.onInputType.bind(this);
        this.formattedRawValue = this.formattedRawValue.bind(this);
        this.getRawValue = this.getRawValue.bind(this);
        this.onClick = this.onClick.bind(this);

        const rawValue = this.getRawValue(this.getValue());

        this.state = {
            rawValue,
            tabIndex: this.props.tabIndex,
            readOnly: this.props.readOnly
        };

        if (rawValue === 0) {
            this.notifyParentWithRawValue(rawValue);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            const input = this.getValue();
            let rawValue = this.getRawValue(input);

            if (!rawValue) {
                rawValue = 0;
            }

            this.setState({
                rawValue
            })
        }
    }

    getValue = () => {
        return Number(this.props.value).toFixed(this.props.precision);
    };

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
        const {delimiter, unit} = this.props;
        let display = this.formattedRawValue(rawValue);

        display = this.removeOccurrences(display, delimiter);
        display = this.removeOccurrences(display, unit);
        display = this.removeOccurrences(display, " ");

        this.props.onChange(display)
    }

    getRawValue(displayedValue) {
        const {delimiter, separator, unit, maxLength} = this.props;
        let result = displayedValue;

        result = this.removeOccurrences(result, delimiter);
        result = this.removeOccurrences(result, unit);
        result = this.removeOccurrences(result, separator);

        let intValue = Number(result);

        if (intValue < Number.MAX_SAFE_INTEGER + 1 && String(intValue).length <= maxLength) {
            return intValue
        }

        return this.state ? this.state.rawValue : 0;
    }

    formattedRawValue(rawValue) {
        const minChars = '0'.length + this.props.precision;

        let result = `${rawValue}`;

        if (result.length < minChars) {
            const leftZeroesToAdd = minChars - result.length;
            result = `${this.repeatZeroes(leftZeroesToAdd)}${result}`;
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

        if (this.props.precision > 1) {
            result = beforeSeparator + this.props.separator + afterSeparator;
        } else {
            result = beforeSeparator;
        }

        if (this.props.unit) {
            result = `${this.props.unit} ${result}`;
        }

        return result;
    }

    repeatZeroes(times) {
        return (new Array(times+1)).join('0')
    }

    removeOccurrences(from, toRemove) {
        toRemove = toRemove.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        const re = new RegExp(toRemove, 'g');
        return String(from).replace(re, '');
    }

    onClick(event) {
        const {rawValue} = this.state;
        const {onClick} = this.props;
        const len = this.formattedRawValue(rawValue).length * 2;

        setTimeout(() => {
            const element = this.inputRef.current;
            element.setSelectionRange(len, len);
        }, 10);

        onClick && onClick(event);
    }

    render() {
        return (
            <input
                {...this.props}
                maxLength="524288"
                ref={this.inputRef}
                onClick={this.onClick}
                onChange={this.onInputType}
                value={this.formattedRawValue(this.state.rawValue)}
            />
        )
    }
}

LmNumber.propTypes = {
    maxLength: PropTypes.number,
    delimiter: PropTypes.string,
    disabled: PropTypes.bool,
    precision: PropTypes.number,
    separator: PropTypes.string,
    unit: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
    ]),
};

LmNumber.defaultProps = {
    maxLength: 16,
    value: 0,
    precision: 2,
    separator: '.',
    delimiter: ',',
    unit: '',
};

export default LmNumber