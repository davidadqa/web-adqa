// Partners y fabricantes que se pueden citar (decisiones del cliente).
// `partners`: bloque «Somos partners de» de la home. `bySection`: dónde citar cada marca en las páginas.
export default {
  partners: [
    "Google Cloud Partner", "Ruckus", "WatchGuard", "MikroTik MTCRE", "HP", "Intel", "Avaya",
    "Wildix", "Xarxa Oberta", "Huawei", "Hornetsecurity", "Veeam", "Salicru",
  ],
  bySection: {
    ciberseguridad: ["WatchGuard", "Hornetsecurity"],
    backup: ["Veeam", "Hornetsecurity"],
    wifiRedes: ["Ruckus", "Aruba", "Huawei"],
    centralitas: ["Wildix"],
    hardware: ["Lenovo", "HP"],
    sai: ["Salicru"],
    networking: ["MikroTik", "Huawei", "Aruba"],
  },
  // Marcas que NO se citan: Fortinet, Fluke, Cisco, Ubiquiti, HPE. Microsoft no es partner oficial: «Expertos en Microsoft 365».
};
