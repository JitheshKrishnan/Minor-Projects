import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class ScanQRCode extends StatefulWidget {
  const ScanQRCode({Key? key}) : super(key: key);

  @override
  State<ScanQRCode> createState() => _ScanQRCodeState();
}

class _ScanQRCodeState extends State<ScanQRCode> {
  String qrResult = 'Scanned data will appear here';

  Future<void> scanQR() async {
    try {
      final qrCode = await FlutterBarcodeScanner.scanBarcode(
          '#ff6666', 'Cancel', true, ScanMode.QR);
      if (!mounted) return;

      //Perform string operation on the scanned result
      processQRCodeResult(qrCode);

      setState(() {
        this.qrResult = qrCode.toString();
      });
    } on PlatformException {
      qrResult = 'Failed to read QR Code';
    }
  }

  //Perform string operation on the scanned result
  void processQRCodeResult(String qrCode) {
    // Parse the QR code and navigate to the details screen
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DetailsScreen(qrCode),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('QR Code Scanner'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              height: 30.0,
            ),
            Text(
              '$qrResult',
              style: TextStyle(
                color: Colors.black,
              ),
            ),
            SizedBox(
              height: 30.0,
            ),
            ElevatedButton(onPressed: scanQR, child: Text('Tap to scan')),
          ],
        ),
      ),
    );
  }
}

class DetailsScreen extends StatefulWidget {
  final String qrCode;

  DetailsScreen(this.qrCode);

  @override
  State<DetailsScreen> createState() => _DetailsScreenState();
}

class _DetailsScreenState extends State<DetailsScreen> {

  @override
  Widget build(BuildContext context) {
    // Extract the bill number from the QR code
    String billNumber = getBillNumber(widget.qrCode);

    // Parse the QR code and extract information
    List<Medicine> medicines = parseQRCode(widget.qrCode);

    // Calculate the total amount and total cost of all medicines
    int totalAmount =
        medicines.fold(0, (sum, medicine) => sum + medicine.amount);
    int totalCost = medicines.fold(
        0, (sum, medicine) => sum + (medicine.amount * medicine.cost));

    // Add an additional ListTile at the end with the total amount and total cost
    //medicines.add(Medicine(name: 'Total', amount: totalAmount, cost: totalCost));

    return Scaffold(
      appBar: AppBar(
        title: Text('Bill No. $billNumber'),
      ),
      body: Column(
        children: [
          for (int index = 0; index < medicines.length; index++)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: ListTile(
                title: Text(medicines[index].name),
                subtitle: Text(
                  'Quantity: ${medicines[index].amount}',
                ),
                trailing: Text(
                    'Rs.${medicines[index].amount * medicines[index].cost}'),
                tileColor: Colors.grey.shade300,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10.0)),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ListTile(
              title: Text('Total'),
              subtitle: Text('Total Quantity: ${totalAmount}'),
              trailing: Text('Rs.${totalCost}'),
              tileColor: Colors.blue.shade100,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.0)),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AddUser(medicines, billNumber),
                ),
              );
            },
            child: Text(
              'Get medicine',
              style: TextStyle(color: Colors.black),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.lightGreenAccent,
            ),
          )
        ],
      ),
    );
  }

  String getBillNumber(String qrCode) {
    // Split the QR code based on the '#' character
    List<String> parts = qrCode.split('#');

    // Check if there are enough parts to extract the bill number
    if (parts.length > 0) {
      // The bill number is the first part
      return parts[0];
    } else {
      return 'Unknown Bill';
    }
  }

  List<Medicine> parseQRCode(String qrCode) {
    List<Medicine> medicines = [];
    // Split the QR code into medicine entries
    List<String> medicineEntries = qrCode.split('#');

    // Iterate through each medicine entry and extract information
    for (String entry in medicineEntries) {
      if (entry.isNotEmpty) {
        // Extract medicine code and amount
        List<String> parts = entry.split(':');
        if (parts.length == 2) {
          String medicineCode = parts[0];
          String amountString = parts[1];

          // Parse the amount as an integer, default to 0 if parsing fails
          int parsedAmount = int.tryParse(amountString) ?? 0;

          // Map medicine codes to their names and costs
          Medicine medicine = getMedicineDetails(medicineCode, parsedAmount);

          // Add the medicine details to the list
          medicines.add(Medicine(
            name: medicine.name,
            amount: parsedAmount,
            cost: medicine.cost,
          ));
        }
      }
    }

    return medicines;
  }

  Medicine getMedicineDetails(String medicineCode, int parsedAmount) {
    // Parse the amount as an integer, default to 0 if parsing fails

    // Map medicine codes to their names and costs
    switch (medicineCode) {
      case 'M001':
        return Medicine(
            name: 'Nimbadi Choornam', amount: parsedAmount, cost: 35);
      case 'M002':
        return Medicine(name: 'D - Nil', amount: parsedAmount, cost: 150);
      case 'M003':
        return Medicine(
            name: 'Drakshadi Kashayam', amount: parsedAmount, cost: 170);
      // Add more mappings as needed
      default:
        return Medicine(
            name: 'Unknown Medicine', amount: parsedAmount, cost: 0);
    }
  }
}

class Medicine {
  final String name;
  final int amount;
  final int cost;

  Medicine({required this.name, required this.amount, required this.cost});
}


class AddUser extends StatelessWidget {
  final List<Medicine> medicines;
  final String billNumber;

  AddUser(this.medicines, this.billNumber);

  @override
  Widget build(BuildContext context) {
    // Ensure that Firebase is initialized before accessing Firestore
    if (Firebase.apps.isEmpty) {
      Firebase.initializeApp();
    }

    // Create a CollectionReference called users that references the firestore collection
    CollectionReference x = FirebaseFirestore.instance.collection('Users');

    Future<void> addUser(Medicine medicine, String billNumber) {
      // Call the user's CollectionReference to add a new user
      return x
          .add({
        'Bill No.': billNumber,
        'Medicine Name': medicine.name,
        'Quantity': medicine.amount,
      })
          .then((value) => print("User Added"))
          .catchError((error) => print("Failed to add user: $error"));
    }

    // Loop through the medicines list and call addUser for each medicine
    for (Medicine medicine in medicines) {
      addUser(medicine, billNumber);
    }

    return Center(
      child: Text('Success'),
    );
  }
}

