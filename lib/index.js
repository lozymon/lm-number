'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactNumber = function (_Component) {
    _inherits(ReactNumber, _Component);

    function ReactNumber(props) {
        _classCallCheck(this, ReactNumber);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.inputRef = _react2.default.createRef();
        _this.onInputType = _this.onInputType.bind(_this);
        _this.formattedRawValue = _this.formattedRawValue.bind(_this);
        _this.getRawValue = _this.getRawValue.bind(_this);
        _this.onClick = _this.onClick.bind(_this);

        _this.state = {
            rawValue: _this.props.value,
            tabIndex: _this.props.tabIndex,
            readOnly: _this.props.readOnly
        };
        return _this;
    }

    ReactNumber.prototype.onInputType = function onInputType(event) {
        var input = event.target.value;
        var rawValue = this.getRawValue(input);
        if (!rawValue) {
            rawValue = 0;
        }

        this.notifyParentWithRawValue(rawValue);

        this.setState({
            rawValue: rawValue
        });
    };

    ReactNumber.prototype.notifyParentWithRawValue = function notifyParentWithRawValue(rawValue) {
        var display = this.formattedRawValue(rawValue);
        this.props.onChange(rawValue, display);
    };

    ReactNumber.prototype.getRawValue = function getRawValue(displayedValue) {
        var result = displayedValue;

        result = removeOccurrences(result, this.props.delimiter);
        result = removeOccurrences(result, this.props.separator);
        result = removeOccurrences(result, this.props.unit);

        var intValue = Number(result);

        if (intValue < Number.MAX_SAFE_INTEGER + 1) {
            return intValue;
        }

        return this.state.rawValue;
    };

    ReactNumber.prototype.formattedRawValue = function formattedRawValue(rawValue) {
        var minChars = '0'.length + this.props.precision;

        var result = '' + rawValue;

        if (result.length < minChars) {
            var leftZeroesToAdd = minChars - result.length;
            result = '' + repeatZeroes(leftZeroesToAdd) + result;
        }

        var beforeSeparator = result.slice(0, result.length - this.props.precision);
        var afterSeparator = result.slice(result.length - this.props.precision);

        if (beforeSeparator.length > 3) {
            var chars = beforeSeparator.split('').reverse();
            var withDots = '';
            for (var i = chars.length - 1; i >= 0; i--) {
                var char = chars[i];
                var dot = i % 3 === 0 ? this.props.delimiter : '';
                withDots = '' + withDots + char + dot;
            }
            withDots = withDots.substring(0, withDots.length - 1);
            beforeSeparator = withDots;
        }
        result = beforeSeparator + this.props.separator + afterSeparator;

        if (this.props.unit) {
            result = this.props.unit + ' ' + result;
        }

        return result;
    };

    ReactNumber.prototype.onClick = function onClick() {
        var _this2 = this;

        var rawValue = this.state.rawValue;

        var len = this.formattedRawValue(rawValue).length * 2;

        setTimeout(function () {
            var element = _this2.inputRef.current;
            element.setSelectionRange(len, len);
        }, 10);
    };

    ReactNumber.prototype.render = function render() {
        return _react2.default.createElement('input', {
            ref: this.inputRef,
            id: this.props.id,
            className: this.props.className,
            onBlur: this.props.onBlur,
            onFocus: this.props.onFocus,
            onClick: this.onClick,
            onChange: this.onInputType,
            onKeyUp: this.props.onKeyUp,
            onKeyPress: this.props.onKeyPress,
            value: this.formattedRawValue(this.state.rawValue),
            disabled: this.props.disabled,
            autoFocus: this.props.autoFocus,
            tabIndex: this.state.tabIndex,
            readOnly: this.state.readOnly,
            autoComplete: this.props.autoComplete,
            autoCorrect: this.props.autoCorrect,
            name: this.props.name,
            placeholder: this.props.placeholder
        });
    };

    return ReactNumber;
}(_react.Component);

var repeatZeroes = function repeatZeroes(times) {
    var result = '';

    for (var i = 0; i < times; i++) {
        result += '0';
    }

    return result;
};

var removeOccurrences = function removeOccurrences(from, toRemove) {
    toRemove = toRemove.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    var re = new RegExp(toRemove, 'g');
    return from.replace(re, '');
};

ReactNumber.propTypes = process.env.NODE_ENV !== "production" ? {
    id: _propTypes2.default.string,
    autoFocus: _propTypes2.default.bool,
    delimiter: _propTypes2.default.string,
    disabled: _propTypes2.default.bool,
    onChange: _propTypes2.default.func,
    onBlur: _propTypes2.default.func,
    onFocus: _propTypes2.default.func,
    onKeyUp: _propTypes2.default.func,
    onKeyPress: _propTypes2.default.func,
    precision: _propTypes2.default.number,
    readOnly: _propTypes2.default.bool,
    separator: _propTypes2.default.string,
    tabIndex: _propTypes2.default.number,
    unit: _propTypes2.default.string,
    value: _propTypes2.default.number.isRequired,
    className: _propTypes2.default.string
} : {};

ReactNumber.defaultProps = {
    value: 0,
    precision: 2,
    separator: '.',
    delimiter: ',',
    unit: '',
    disabled: false,
    autoFocus: false,
    className: '',
    onChange: function onChange() {},
    onBlur: function onBlur() {},
    onFocus: function onFocus() {},
    onKeyUp: function onKeyUp() {},
    onKeyPress: function onKeyPress() {}
};

exports.default = ReactNumber;
module.exports = exports['default'];