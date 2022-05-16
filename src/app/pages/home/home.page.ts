import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// Components
import { IonSlides, ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('mySlider') slides: IonSlides;
  // Form Room
  roomForm: FormGroup;
  isSubmitted = false;
  // Wall Form
  wallForm: FormGroup;
  // Tables Form
  tablesForm: FormGroup
  // textBox Form
  textBoxForm: FormGroup
  // Edit Room Form
  editRoomForm: FormGroup
  // Slider Options
  slideOpts = {
    initialSlide: 0,
    allowTouchMove: false,
    speed: 400
  };
  // Variables Walls
  public wallContainer: boolean = false;
  public itemOptions: boolean = false;
  // Array's accessories
  walls = []
  //
  // Wall Item
  wallItem = [{
    disabled: false,
    width: '150',
    height: '10'
  }]
  // Variables Tables
  public tablesContainer: boolean = false;
  public itemOptionsTables: boolean = false;
  // Tables Item 
  tablesItemForm = [{
    width: '60',
    height: '30'
  }]
  // Variables Chairs
  public chairsContainer: boolean = false;
  public itemOptionsChairs: boolean = false;
  // Variables TextBox
  public textBoxContainer: boolean = false;
  public itemOptionsTextBox: boolean = false;
  // Variables Room
  public showEditRoom: boolean = false;
  public roomContainerForm: boolean = false;
  roomItem: any
  roomNameEdit: string
  // Array Rooms
  rooms = [];
  // Variables Options 
  public optionsPanel: boolean = true;
  public panelAcessories: boolean = true;
  buttonText = 'Hide Rooms'
  buttonTextAcessories = 'Hide accessories'
  iconAcessories = 'close'
  iconPanel = 'close'

  selectedItem: any;
  indexItem: any;
  remoteToggle: boolean
  buttonDisabled = true
  private loading;


  // Status to chairs and Tables
  statusItem = [
    {
      value: "Empty",
      id: 0,
      icon: "person-add-outline"
    },
    {
      value: "With Order",
      id: 1,
      icon: "wine-outline"
    },
    {
      value: "Dispatched",
      id: 2,
      icon: "card-outline"
    }
  ]
  itemStatus: any


  constructor(private storage: Storage, public alertController: AlertController, public toastController: ToastController, public loadingController: LoadingController, public formBuilder: FormBuilder, private sanitizer: DomSanitizer, public modalController: ModalController) {
 
  }

  async ngOnInit() {
    await this.storage.create();
    //this.getRooms()
    this.roomForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    })
    this.wallForm = this.formBuilder.group({
      width: [''],
      height: ['']
    })
    this.tablesForm = this.formBuilder.group({
      width: [''],
      height: ['']
    })
    this.textBoxForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    })
    this.editRoomForm = this.formBuilder.group({
      nameRoom: ['', [Validators.required]]
    })
  }
  async ionViewDidLoad() {
    await this.getRooms()
  }
  // Get Rooms
  async getRooms() {
    await this.storage.get('rooms').then((rooms) => {
      this.rooms = rooms
    })
    console.log("Rooms?", this.rooms)
  }
  // Toggle Panel options 
  toggleOptions() {
    this.optionsPanel = !this.optionsPanel;
    if (this.optionsPanel) {
      this.buttonText = 'Hide Rooms'
      this.iconPanel = 'close'
    } else {
      this.buttonText = 'Show Rooms'
      this.iconPanel = 'menu'
    }
  }
  // Toggle Acessories
  toggleAcessories() {
    this.panelAcessories = !this.panelAcessories;
    if (this.panelAcessories) {
      this.buttonTextAcessories = 'Hide Accessories'
      this.iconAcessories = 'close'
    } else {
      this.buttonTextAcessories = 'Show Accessories'
      this.iconAcessories = 'menu'
    }
  }
  // create Room Functions
  openRoomForm() {
    this.roomContainerForm = !this.roomContainerForm;
  }
  closedRoomForm() {
    this.roomContainerForm = false;
    this.roomForm.reset()
  }
  // Handle Errors Functions
  get errorControl() {
    return this.roomForm.controls;
  }

  get errorTextBoxControl() {
    return this.textBoxForm.controls
  }

  get errorEditRoom() {
    return this.editRoomForm.controls
  }
  // End Handle Errors Functions
  submitForm() {
    this.isSubmitted = true;
    if (!this.roomForm.valid) {
      return false;
    } else {
      this.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        })
        .then((overlay) => {
          this.loading = overlay;
          this.loading.present();
        });
      setTimeout(() => {
        this.loading.dismiss();
        let roomItem = {
          nombre: this.roomForm.value.name,
          elementos: {
            walls: [],
            chairs: [],
            tables: [],
            textbox: []
          }
        }
        this.rooms.push(roomItem)
        this.storage.set('rooms', this.rooms)
        this.roomContainerForm = false
        this.roomForm.reset()
        this.presentToast()
      }, 3000);
    }
  }

  deleteRoom(i) {
    this.roomItem = i
    this.presentAlertConfirm()
  }

  // Alert Delete Room 
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Delete Room!',
      message: 'Are you sure you want to delete the room?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
          }
        }, {
          text: 'Delete',
          id: 'confirm-button',
          handler: () => {
            let index = this.rooms.indexOf(this.roomItem);

            if (index > -1) {
              this.rooms.splice(index, 1);
              this.itemOptions = false
              this.itemOptionsChairs = false
              this.itemOptionsTables = false
              this.itemOptionsTextBox = false

              this.storage.set('rooms', this.rooms)
            }
          }
        }
      ]
    });

    await alert.present();
  }

  editRoom(i) {
    this.roomItem = i
    this.showEditRoom = true;
  }

  cancelEditRoom() {
    this.roomNameEdit = ''
    this.showEditRoom = false;
  }

  saveEditRoom() {
    this.isSubmitted = true;
    if (!this.editRoomForm.valid) {
      return false;
    } else {
      this.roomItem.nombre = this.roomNameEdit
      this.storage.set('rooms', this.rooms)
      this.roomNameEdit = ''
      this.showEditRoom = false;
    }

  }
  //

  // Totast room Create
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'The room has been successfully created.',
      position: 'middle',
      icon: 'checkmark-done-outline',
      duration: 2000
    });
    toast.present();
  }
  //

  // Slider Functions
  swipeNext(index) {
    this.slides.slideTo(index)
    this.wallContainer = false
    this.itemOptions = false
  }
  //

  // Accessories Functions
  addWall(i) {
    this.rooms[i].elementos['walls'].push({
      disabled: false,
      width: this.wallForm.value.width,
      height: this.wallForm.value.height
      //translate: "translate3d(141px, 52px, 0px)"
    })
    this.storage.set('rooms', this.rooms)
    this.wallContainer = false
  }

  addTables(i) {
    this.rooms[i].elementos['tables'].push({
      status: this.itemStatus,
      width: this.tablesForm.value.width,
      height: this.tablesForm.value.height,
      disabled: false
    })
    this.storage.set('rooms', this.rooms)
  }

  addChairs(i) {
    this.rooms[i].elementos['chairs'].push({
      status: this.itemStatus,
      disabled: false
    })
    this.storage.set('rooms', this.rooms)
  }
  addTextBox(i) {
    this.isSubmitted = true;
    if (!this.textBoxForm.valid) {
      return false;
    } else {
      this.rooms[i].elementos['textbox'].push({
        value: this.textBoxForm.value.name,
        status: this.itemStatus,
        disabled: false
      })
      this.storage.set('rooms', this.rooms)
    }
  }

  tablesStatus($event) {
    this.itemStatus = $event.target.value
    this.buttonDisabled = false;
    this.storage.set('rooms', this.rooms)
  }

  editTablesStatus($event) {
    this.itemStatus = $event.target.value
    this.selectedItem.status = this.itemStatus
    this.storage.set('rooms', this.rooms)
  }

  openWallContainer() {
    this.wallContainer = !this.wallContainer;
    this.tablesContainer = false
    this.chairsContainer = false
    this.textBoxContainer = false
    this.itemOptions = false
    this.itemOptionsTables = false
    this.itemOptionsChairs = false
  }

  openTablesContainer() {
    this.tablesContainer = !this.tablesContainer;
    this.wallContainer = false
    this.chairsContainer = false
    this.textBoxContainer = false
    this.itemOptions = false
    this.itemOptionsTables = false
    this.itemOptionsChairs = false
    this.buttonDisabled = true;
  }

  openChairsContainer() {
    this.chairsContainer = !this.chairsContainer;
    this.tablesContainer = false
    this.wallContainer = false
    this.textBoxContainer = false
    this.itemOptions = false
    this.itemOptionsTables = false
    this.itemOptionsChairs = false
    this.buttonDisabled = true;
  }

  openTextBoxContainer() {
    this.textBoxContainer = !this.textBoxContainer;
    this.tablesContainer = false
    this.wallContainer = false
    this.chairsContainer = false
    this.itemOptions = false
    this.itemOptionsTables = false
    this.itemOptionsChairs = false
    this.buttonDisabled = true;
  }

  itemOptionsOpen(item, i) {
    this.indexItem = i
    this.selectedItem = item
    this.remoteToggle = this.selectedItem.disabled
    this.itemOptions = !this.itemOptions;
  }

  itemOptionsTablesOpen(item, i) {
    this.indexItem = i
    this.selectedItem = item
    this.remoteToggle = this.selectedItem.disabled
    this.itemOptionsTables = !this.itemOptionsTables;
  }

  itemOptionsChairsOpen(item, i) {
    this.indexItem = i
    this.selectedItem = item
    this.remoteToggle = this.selectedItem.disabled
    this.itemOptionsChairs = !this.itemOptionsChairs;
  }
  itemOptionsTextBoxOpen(item, i) {
    this.indexItem = i
    this.selectedItem = item
    this.remoteToggle = this.selectedItem.disabled
    this.itemOptionsTextBox = !this.itemOptionsTextBox;
  }

  deleteItem() {
    this.rooms.map((item) => {
      let array = item.elementos['walls']
      let index = item.elementos['walls'].indexOf(this.selectedItem)
      if (index > -1) {
        array.splice(index, 1);
        this.storage.set('rooms', this.rooms)
        this.itemOptions = false
      }
    })
  }

  deleteItemTables() {
    this.rooms.map((item) => {
      let array = item.elementos['tables']
      let index = item.elementos['tables'].indexOf(this.selectedItem)
      if (index > -1) {
        array.splice(index, 1);
        this.storage.set('rooms', this.rooms)
        this.itemOptionsTables = false
      }
    })
  }

  deleteItemChairs() {
    this.rooms.map((item) => {
      let array = item.elementos['chairs']
      let index = item.elementos['chairs'].indexOf(this.selectedItem)
      if (index > -1) {
        array.splice(index, 1);
        this.storage.set('rooms', this.rooms)
        this.itemOptionsChairs = false
      }
    })
  }

  deleteItemTextBox() {
    this.rooms.map((item) => {
      let array = item.elementos['textbox']
      let index = item.elementos['textbox'].indexOf(this.selectedItem)
      if (index > -1) {
        array.splice(index, 1);
        this.storage.set('rooms', this.rooms)
        this.itemOptionsTextBox = false
      }
    })
  }

  toggleStatus() {
    this.selectedItem
    if (this.remoteToggle == false) {
      this.selectedItem.disabled = false;
      this.storage.set('rooms', this.rooms)
    } else {
      this.selectedItem.disabled = true
      this.storage.set('rooms', this.rooms)
    }

  }
  // END Accessories Functions

  getClass(width, height, translate) {
    return this.sanitizer.bypassSecurityTrustStyle(`--widthvar: ${width}px; --heightvar: ${height}px;`)
  }

}
