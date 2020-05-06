import sys

__author__ = 'Meredydd Luff <meredydd@anvil.works>'


class LiveObject():
    def __init__(self, spec):
        self._spec = spec

    def __repr__(self):
        return "<LiveObject: " + self._spec["backend"] + ">"

    def __eq__(self, other):
      return isinstance(other, LiveObject) and other._spec["id"] == self._spec["id"] and other._spec["backend"] == self._spec["backend"]

    def __ne__(self, other):
      return not self.__eq__(other)

    def __hash__(self):
        return hash((self._spec["id"], self._spec["backend"]))


# Hack
def _get_live_object_id(lo):
    if isinstance(lo, LiveObject):
        return lo._spec["id"]
    else:
        raise Exception("Not a LiveObject")

def _clear_live_object_caches(lo):
    if isinstance(lo, LiveObject):
        lo._spec["itemCache"] = {}
        lo._spec["iterItems"] = {}
    else:
        raise Exception("Not a LiveObject")

class Media(object):
    def __getattribute__(self, item):
        if item == "url":
            return self.get_url()
        elif item == "content_type":
            return self.get_content_type()
        elif item == "name":
            return self.get_name()
        elif item == "length":
            return self.get_length()
        else:
            return object.__getattribute__(self, item)

    def get_url(self, download=True):
        return None

    def get_bytes(self):
        raise Exception("get_bytes() not implemented")

    def get_length(self):
        return len(self.get_bytes())

    def get_name(self):
        return None


_unicode_string_type = str if sys.version_info >= (3,) else unicode


class BlobMedia(Media):
    def __init__(self, content_type, content, name=None):
        self._content_type = content_type
        if isinstance(content, _unicode_string_type):
            content = content.encode("utf-8")
        self._bytes = content
        self._name = name

    def get_content_type(self):
        return self._content_type

    def get_bytes(self):
        return self._bytes

    def get_name(self):
        return self._name

    def __repr__(self):
        return "BlobMedia[%s,%d bytes%s]" % (self._content_type, len(self._bytes), (",name=" + self._name if self._name is not None else ""))

DataMedia = BlobMedia


class URLMedia(Media):
    def __init__(self, url):
        self._url = url
        self._fetched = None

    def _fetch(self):
        import anvil.server
        if self._fetched is None:
            self._fetched = anvil.server.call("anvil.private.http.request", url=self._url)['content']
        return self._fetched

    def get_url(self, download=True):
        return self._url

    def get_bytes(self):
        return self._fetch().get_bytes()

    def get_content_type(self):
        return self._fetch().content_type


def create_lazy_media(mime_type, server_function_name, *args, **kwargs):
    import anvil.server
    return anvil.server.call("anvil.private.mk_LazyMedia", mime_type, server_function_name, *args, **kwargs)


def plot_image():
    import anvil.mpl_util
    return anvil.mpl_util.plot_image()


def is_server_side():
    return True


def _get_service_client_config(path):
    # TODO: Return the actual client config!
    return {}


class _AppInfo:
    def __init__(self, id, branch):
        self.__dict__['id'] = id
        self.__dict__['branch'] = branch

    def __setattr__(self, key, value):
        raise AttributeError("This object is read-only")

    def _setup(self, **kwargs):
        self.__dict__.update(kwargs)


app = _AppInfo(None, None)

from ._components import *
