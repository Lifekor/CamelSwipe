from enum import Enum


class MissionStatus(Enum):
    Open = 'open'
    Execution = 'execution'
    Verified = 'verified'
    Completed = 'completed'
