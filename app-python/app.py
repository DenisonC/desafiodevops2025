from flask import Flask
from flask_caching import Cache
from datetime import datetime
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
app.config['CACHE_TYPE'] = 'RedisCache'
app.config['CACHE_REDIS_HOST'] = 'redis'
app.config['CACHE_REDIS_PORT'] = 6379
app.config['CACHE_DEFAULT_TIMEOUT'] = 10

cache = Cache(app)
metrics = PrometheusMetrics(app)

@app.route('/hello')
def hello():
    return 'Olá do Flask!'

@app.route('/time')
@cache.cached()
def time():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
