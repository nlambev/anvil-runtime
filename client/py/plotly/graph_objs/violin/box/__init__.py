
from anvil.util import WrappedObject, WrappedList
from anvil.server import serializable_type


@serializable_type
class Line(WrappedObject):
    _name = "Line"
    _module = "plotly.graph_objs.violin.box"


__all__ = [
    'Line',
]