
from anvil.util import WrappedObject, WrappedList
from anvil.server import serializable_type


@serializable_type
class Marker(WrappedObject):
    _name = "Marker"
    _module = "plotly.graph_objs.scatterpolargl.selected"

@serializable_type
class Textfont(WrappedObject):
    _name = "Textfont"
    _module = "plotly.graph_objs.scatterpolargl.selected"


__all__ = [
    'Marker',
    'Textfont',
]