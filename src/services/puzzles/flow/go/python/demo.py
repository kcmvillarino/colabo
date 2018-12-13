# __package__ = "use-cases"

import uuid
# from colabo.flow.audit import ColaboFlowGo, audit_pb2
from colabo.flow.go import ColaboFlowGo

from random import randint
from time import sleep

colaboFlowGo = ColaboFlowGo()


print("colaboFlowGo = %s" % (colaboFlowGo))


# gets the name of function inspectig stack
def gTFN():
    import traceback
    return traceback.extract_stack(None, 2)[0][2]

# Set of functions
def f1(dataIn):
    print(("[%s] started." % (gTFN())))
    print(("[%s] dataIn: %s" % (gTFN(), dataIn)))
    dataOut = gTFN()+":result:"+dataIn
    return dataOut


def f2(dataIn):
    print(("[%s] started." % (gTFN())))
    print(("[%s] dataIn: %s" % (gTFN(), dataIn)))
    dataOut = gTFN()+":result:"+dataIn
    return dataOut

def f3(dataIn):
    print(("[%s] started." % (gTFN())))
    print(("[%s] dataIn: %s" % (gTFN(), dataIn)))
    dataOut = gTFN()+":result:"+dataIn
    return dataOut


# Running functions
print("---")
r1 = f1("hello 1")
print("r1: %s" %(r1))
print("---")
r2 = f2(r1)
print("r2: %s" % (r2))
print("---")
r3 = f3(r2)
print("r3: %s" % (r3))
