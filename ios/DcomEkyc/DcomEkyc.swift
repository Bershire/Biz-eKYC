import Foundation
import React
import DcomEkycSDK
import UIKit

@objc(EkycModule)
class EkycModule: RCTEventEmitter, DeKYCDelegate {

  private var hasListeners = false
  override static func requiresMainQueueSetup() -> Bool { true }

  // RN >=0.65 require
  override func startObserving() { hasListeners = true }
  override func stopObserving()  { hasListeners = false }

  private var initialized = false

  @objc func initialize(_ appId: String, signature: String, serverURL: String) {
    DispatchQueue.main.async {
      guard !self.initialized else { return }
      let options = DeKYCOptions(
        appId: appId,
        appSignature: signature,
        serverURL: serverURL
      )
      DeKYC.initialize(options: options)
      self.initialized = true
    }
  }

  @objc func startEkyc(_ language: NSString) {
    DispatchQueue.main.async {
      if let presenter = RCTPresentedViewController() {
        DeKYC.instance.setLanguage(language as String)
        DeKYC.instance.start(parent: presenter, delegate: self)
      }
    }
  }

  func onBeginVerify(cardType: DeKYC.CardType, step: DeKYC.VerifyStep) {
    let body: [String: Any] = [
      "event": "onBeginVerify",
      "cardType": "\(cardType)",
      "step": "\(step)"
    ]
    sendEvent(withName: "EkycEvent", body: body)
  }

  func onCardDetected(cardType: DeKYC.CardType, step: DeKYC.VerifyStep, image: UIImage) {
    if let imageData = image.jpegData(compressionQuality: 1.0) {
      let base64String = imageData.base64EncodedString()
      let body: [String: Any] = [
        "event": "onCardDetected",
        "cardType": "\(cardType)",
        "step": "\(step)",
        "imageBase64": base64String
      ]
      sendEvent(withName: "EkycEvent", body: body)
    }
    DeKYC.instance.nextStep()
  }

  func onNFCDetected(cardType: DeKYC.CardType, cardInfo: NFCCard) {
      var cardInfoDict: [String: Any] = [:]
      var sCardType = ""

      switch cardType {
      case .rc:
          sCardType = "rc"
          if let card = cardInfo as? RCCard {
              cardInfoDict["no"] = card.no ?? ""
              cardInfoDict["name"] = card.name ?? ""
              cardInfoDict["address"] = card.address ?? ""
              cardInfoDict["sex"] = card.sex ?? ""
              cardInfoDict["status"] = card.status ?? ""
              cardInfoDict["region"] = card.region ?? ""
              cardInfoDict["dateOfBirth"] = formatDate(card.dateOfBirth)
              cardInfoDict["dateOfBegin"] = formatDate(card.dateOfBegin)
              cardInfoDict["dateOfExpiration"] = formatDate(card.dateOfExpiration)
              cardInfoDict["periodOfStay"] = formatDate(card.periodOfStay)
          }
      case .dl:
          sCardType = "dl"
          if let card = cardInfo as? DriversLicenseCard {
              if let matters = card.matters {
                  cardInfoDict["name"] = matters.name ?? ""
                  cardInfoDict["nickname"] = matters.nickname ?? ""
                  cardInfoDict["commonName"] = matters.commonName ?? ""
                  cardInfoDict["uniformName"] = matters.uniformName ?? ""
                  cardInfoDict["birthdate"] = formatDate(matters.birthdate)
                  cardInfoDict["address"] = matters.address ?? ""
                  cardInfoDict["issuanceDate"] = formatDate(matters.issuanceDate)
                  cardInfoDict["expirationDate"] = formatDate(matters.expirationDate)
                  cardInfoDict["issuingAuthority"] = matters.issuingAuthority ?? ""
                  cardInfoDict["number"] = matters.number ?? ""
              }
              if let domicile = card.registeredDomicile {
                  cardInfoDict["registeredDomicile"] = domicile.registeredDomicile
              }
          }
      case .mn:
          sCardType = "mn"
          if let card = cardInfo as? MyNumberCard {
              cardInfoDict["token"] = card.token ?? ""
              cardInfoDict["individualNumber"] = card.individualNumber ?? ""
              cardInfoDict["name"] = card.name ?? ""
              cardInfoDict["address"] = card.address ?? ""
              cardInfoDict["birth"] = formatDate(card.birth)
              cardInfoDict["sex"] = card.sex ?? ""
              cardInfoDict["expire"] = formatDate(card.expire)
              cardInfoDict["securityCode"] = card.securityCode ?? ""
          }
      @unknown default:
          sCardType = "\(cardType)"
      }
      let body: [String: Any] = [
          "event": "onNFCDetected",
          "cardType": sCardType,
          "cardInfo": cardInfoDict
      ]
      sendEvent(withName: "EkycEvent", body: body)
      DeKYC.instance.nextStep()
  }

  private func formatDate(_ date: Date?) -> String {
      guard let date = date else { return "" }
      let formatter = DateFormatter()
      formatter.dateFormat = "yyyy-MM-dd"
      formatter.locale = Locale(identifier: "en_US_POSIX")
      return formatter.string(from: date)
  }

  func onFinish(cardType: DeKYC.CardType, result: DeKYC.CardVerifyResult) {
    let body: [String: Any] = [
      "event": "onFinish",
      "cardType": "\(cardType)",
      "result": result.result ?? false,
      "msg": result.msg ?? "",
      "liveness": result.liveness ?? 0.0,
      "front": result.front ?? 0.0,
      "tilt": result.tilt ?? 0.0,
      "type": result.type ?? 0,
      "faceToken": result.faceToken ?? ""
    ]
    sendEvent(withName: "EkycEvent", body: body)
  }

  func onDismiss() {
    let body: [String: Any] = ["event": "onDismiss"]
    sendEvent(withName: "EkycEvent", body: body)
  }

  func onBack(from: DeKYC.VerifyStep) {
    let body: [String: Any] = [
      "event": "onBack",
      "from": "\(from)"
    ]
    sendEvent(withName: "EkycEvent", body: body)
  }

  override func supportedEvents() -> [String]! {
    return ["EkycEvent"]
  }
}
