export default function ({ $moment }, inject) {
    const date = function (date) {
        return $moment.locale() === 'en'
            ? $moment(date).format('YYYY-MM-DD')
            : $moment(date).format('L')
    }

    const datetime = function (date) {
        return $moment.locale() === 'en'
            ? $moment(date).format('YYYY-MM-DD HH:mm')
            : $moment(date).format('L HH:mm')
    }

    const time = function (date) {
        return $moment.locale() === 'en'
            ? $moment(date).format('HH:mm')
            : $moment(date).format('HH:mm')
    }

    inject('date', date)
    inject('datetime', datetime)
    inject('time', time)
}
