export enum Alianzas {
  MasterDriverVznla = 'MasterDriverVznla',
  TamborChino = 'TamborChino',
  NeveriKayak = 'NeveriKayak',
  GrupoTuristicoBahia = 'GrupoTuristicoBahia',
  SenderosAnzoategui = 'SenderosAnzoategui',
  RutasDelCafe = 'RutasDelCafe',
  BechTourLecheria = 'BechTourLecheria',
}

export const getAlianzaDisplayName = (alianza: Alianzas) => {
  switch (alianza) {
    case Alianzas.MasterDriverVznla:
      return 'Master Driver Vnzla';
    case Alianzas.TamborChino:
      return 'Tambor Chino';
    case Alianzas.NeveriKayak:
      return 'Neverí Kayak';
    case Alianzas.GrupoTuristicoBahia:
      return 'Grupo Turístico Bahía';
    case Alianzas.SenderosAnzoategui:
      return 'Senderos Anzoátegui';
    case Alianzas.RutasDelCafe:
      return 'Rutas Del Café';
    case Alianzas.BechTourLecheria:
      return 'Bech Tour Lechería';
    default:
      break;
  }
  return alianza;
};

// export enum Alianzas {
//   MasterDriverVznla = 'Master Driver Vnzla',
//   TamborChino = 'Tambor Chino',
//   NeveriKayak = 'Neverí Kayak',
//   GrupoTuristicoBahia = 'Grupo Turístico Bahía',
//   SenderosAnzoategui = 'Senderos Anzoátegui',
//   RutasDelCafe = 'Rutas Del Café',
//   BechTourLecheria = 'Bech Tour Lechería',
// }
