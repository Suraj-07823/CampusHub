from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler):
    server_address = ('127.0.0.1', 5500)
    httpd = server_class(server_address, handler_class)
    print(f"Server running at http://127.0.0.1:5500")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
