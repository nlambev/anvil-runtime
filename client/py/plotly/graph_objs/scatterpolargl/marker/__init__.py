
from anvil.util import WrappedObject, WrappedList
from anvil.server import serializable_type


@serializable_type
class ColorBar(WrappedObject):
    _name = "ColorBar"
    _module = "plotly.graph_objs.scatterpolargl.marker"

@serializable_type
class Line(WrappedObject):
    _name = "Line"
    _module = "plotly.graph_objs.scatterpolargl.marker"


__all__ = [
    'ColorBar',
    'Line',
    'colorbar',
]

from plotly.graph_objs.scatterpolargl.marker import colorbar
