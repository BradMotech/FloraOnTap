import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

const UnfoldText = ({ onLinkMerchantAccount, globalStyles, tokens }) => {
  const [isUnfolded, setIsUnfolded] = useState(false);

  const handleUnfold = () => {
    setIsUnfolded(!isUnfolded);
  };

  return (
    <Text
      style={[
        globalStyles.subtitle,
        { marginTop: tokens.spacing.md, marginBottom: tokens.spacing.md },
      ]}
    >
      {!isUnfolded ? (
        <>
          {"To begin receiving payments, please configure your payment settings and link your preferred merchant account... "}
          <TouchableOpacity onPress={handleUnfold}>
            <Text style={{ color: tokens.colors.skyBlueColor }}>Read more</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {
            "To begin receiving payments, please configure your payment settings and link your preferred merchant account. Once done linking your merchant account, configure your subscription by clicking the subscription button below. "
          }
          <Text
            style={{ color: tokens.colors.skyBlueColor }}
            onPress={onLinkMerchantAccount}
          >
            {"Click here"}
          </Text>
          {" to get started."}
          <TouchableOpacity onPress={handleUnfold}>
            <Text style={{ color: tokens.colors.skyBlueColor }}>Read less</Text>
          </TouchableOpacity>
        </>
      )}
    </Text>
  );
};

export default UnfoldText;
