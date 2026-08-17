document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.stat .count');
    const speed = 180; // lower = faster

    function formatValue(value, format, prefix = '', suffix = '') {
        if (format === 'compact-long') {
            // use Intl NumberFormat with long compact display, then capitalize words
            const nf = new Intl.NumberFormat('en', {
                notation: 'compact',
                compactDisplay: 'long',
                maximumFractionDigits: 2,
            });
            let out = nf.format(value);
            // capitalize first letters: "30 million" -> "30 Million"
            out = out.replace(/\b[a-z]/g, (s) => s.toUpperCase());
            return prefix + out + suffix;
        }

        if (format === 'compact-short') {
            const nf = new Intl.NumberFormat('en', {
                notation: 'compact',
                compactDisplay: 'short',
                maximumFractionDigits: 2,
            });
            return prefix + nf.format(value) + suffix;
        }

        if (format === 'number-plus') {
            const nf = new Intl.NumberFormat('en');
            return prefix + nf.format(Math.round(value)) + (suffix || '+');
        }

        // default number formatting
        const nf = new Intl.NumberFormat('en');
        return prefix + nf.format(Math.round(value)) + suffix;
    }

    counters.forEach((counter) => {
        const target = +counter.getAttribute('data-target');
        const format = counter.getAttribute('data-format') || 'number';
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';

        let started = false;

        const obs = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !started) {
                        started = true;

                        const duration = 1100; // ms
                        const start = performance.now();

                        function easeOutCubic(t) {
                            return 1 - Math.pow(1 - t, 3);
                        }

                        function animate(now) {
                            const elapsed = now - start;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = easeOutCubic(progress);
                            const current = Math.floor(target * eased);

                            // During animation show plain localized digits (stable), no compact words
                            const during = prefix + new Intl.NumberFormat('en').format(current) + (format === 'number-plus' ? '' : '');
                            counter.innerText = during;

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                // Final formatted value (compact-long / number-plus / default)
                                counter.innerText = formatValue(target, format, prefix, suffix);
                            }
                        }

                        requestAnimationFrame(animate);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.35 }
        );

        obs.observe(counter);
    });
});
