import mailchimp from '@mailchimp/mailchimp_marketing';
import crypto from 'crypto';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export interface SubscriberData {
  email: string;
  firstName?: string;
  lastName?: string;
  language?: 'pl' | 'en';
  leadMagnet?: string;
  tags?: string[];
}

export async function addSubscriber(data: SubscriberData) {
  try {
    // First, add the subscriber
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID!,
      {
        email_address: data.email,
        status: 'subscribed', // or 'pending' for double opt-in
        merge_fields: {
          FNAME: data.firstName || '',
          LNAME: data.lastName || '',
        },
      }
    );

    // Then add tags if provided
    if (data.tags && data.tags.length > 0) {
      await addTagsToSubscriber(data.email, data.tags);
    }

    return { success: true, data: response };
  } catch (error: unknown) {
    // Handle duplicate email gracefully
    const err = error as { status?: number; response?: { body?: { title?: string } }; message?: string };
    if (err.status === 400 && err.response?.body?.title === 'Member Exists') {
      // If already subscribed, try to add tags
      if (data.tags && data.tags.length > 0) {
        await addTagsToSubscriber(data.email, data.tags);
      }
      return { success: true, alreadySubscribed: true };
    }

    console.error('Mailchimp error:', error);
    console.error('Error details:', JSON.stringify(err.response?.body, null, 2));
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function addTagsToSubscriber(email: string, tags: string[]) {
  try {
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    await mailchimp.lists.updateListMemberTags(
      process.env.MAILCHIMP_AUDIENCE_ID!,
      subscriberHash,
      {
        tags: tags.map(tag => ({ name: tag, status: 'active' }))
      }
    );

    return { success: true };
  } catch (error: unknown) {
    console.error('Add tags error:', error);
    const err = error as { message?: string };
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function getSubscriberInfo(email: string) {
  try {
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    const response = await mailchimp.lists.getListMember(
      process.env.MAILCHIMP_AUDIENCE_ID!,
      subscriberHash
    );

    return { success: true, data: response };
  } catch (error: unknown) {
    const err = error as { message?: string };
    return { success: false, error: err.message || 'Unknown error' };
  }
}

export async function getAudienceStats() {
  try {
    const response = await mailchimp.lists.getList(
      process.env.MAILCHIMP_AUDIENCE_ID!
    );

    return {
      success: true,
      stats: {
        memberCount: response.stats.member_count,
        openRate: response.stats.open_rate,
        clickRate: response.stats.click_rate,
      }
    };
  } catch (error: unknown) {
    console.error('Get stats error:', error);
    const err = error as { message?: string };
    return { success: false, error: err.message || 'Unknown error' };
  }
}
