import http.server
import socketserver

def read_api_key():
    try:
        with open("apikey.txt", "r") as file:
            return file.read().strip()
    except FileNotFoundError:
        return None

class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            api_key = read_api_key()
            if api_key is None:
                api_key = "Your API Key Here"
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

            with open("index.html", "r", encoding="utf-8") as file:
                html_content = file.read()
                html_content = html_content.replace("{{API_KEY}}", api_key)
                self.wfile.write(html_content.encode("utf-8"))
        else:
            super().do_GET()

PORT = 8000
Handler = MyRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)
print(f"Serving at port {PORT}")
httpd.serve_forever()
